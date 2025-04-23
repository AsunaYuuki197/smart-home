from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from config.general_cfg import *
from routes.control import *
from routes.autorule import *
from utils.general_helper import receive_feed_value
from background.tasks import send_notification
import asyncio, time
from utils.logger import Logger
from datetime import datetime


LOGGER = Logger(__file__,log_file="agent.log")

scheduler = AsyncIOScheduler()

# Auto sent notify and control based on condition
async def get_sensor_data():
    start_time = time.time()

    cursor = user_collection.find({}, {'fcm_tokens':1,'devices': 1, 'user_id': 1, 'noti': 1, '_id': 0})
    async for user in cursor:
        temp_sensor = receive_feed_value(os.getenv("AIO_KEY"), os.getenv("AIO_USERNAME"), os.getenv("TEMPERATURE_FEED"), "last")
        humid_sensor = receive_feed_value(os.getenv("AIO_KEY"), os.getenv("AIO_USERNAME"), os.getenv("HUMIDITY_FEED"), "last")

        for device_id in user.get('devices', []):
            device = await db.Devices.find_one({"device_id": device_id}, {'device_id':1 , 'type': 1})
            if not device:
                continue
            if device['type'] == "Light sensor":
                light_sensor = receive_feed_value(os.getenv("AIO_KEY"), os.getenv("AIO_USERNAME"), os.getenv("LIGHT_SENSOR_FEED"), "last")   
                asyncio.create_task(controlLight_by_condition(user,float(light_sensor['value']),device))
            elif device['type'] == "Temperature sensor":   
                asyncio.create_task(fire_alarm(user,float(temp_sensor['value']),device))
                asyncio.create_task(hot_alarm(user,float(temp_sensor['value']), device))
                asyncio.create_task(controlFan_by_condition(user,float(temp_sensor.get('value')),float(humid_sensor.get('value')),device))
            elif device['type'] == "Humidity sensor":    
                asyncio.create_task(controlFan_by_condition(user,float(temp_sensor.get('value')),float(humid_sensor.get('value')),device))

    process_time = time.time() - start_time

    next_run = datetime.now() + timedelta(seconds=10)

    LOGGER.log.info(
        f'Job "get_sensor_data (trigger: interval[10 seconds], '
        f'next run at: {next_run.strftime("%Y-%m-%d %H:%M:%S")})" '
        f'executed successfully - {process_time:.2f}s'
    )

async def fire_alarm(user: dict, temp_sensor_val: float, device):
    if user['noti']['status'] == "off":
        return
    
    if temp_sensor_val < FIRE_ALARM_THRESHOLD:
        
        pump_last = await device_status(6)
        if pump_last is None or not pump_last.get('action'):
            return

        user_id_ctx.set(user['user_id'])
        await turn_off_pump(ActionLog(
            device_id=device['device_id'],
            action=0
        ))
        return 
    
    send_notification.apply_async(args=[user, "Cháy rồi bro ơi 😭😭", "Máy bơm đang hoạt động để dập lửa, mau gọi cứu hỏa đi ...", device['device_id']])
    user_id_ctx.set(user['user_id'])
    await turn_on_pump(ActionLog(
        device_id=device['device_id'],
        action=1
    ))

    return


async def hot_alarm(user: dict, temp_sensor_val: float, device: dict):
    if user['noti'].get('hot_notif', "off") == "off":
        return

    if temp_sensor_val < user['noti']['temp']:
        return 
    
    send_notification.apply_async(args=[user, "Nóng quá 🥵🥵", "Bạn có muốn bật quạt không :)))", device['device_id']])
    
    return


def in_time_frame(time_rule: dict):
    if time_rule and time_rule.get("rule_time", "off") == "on" and time_rule.get("repeat", 0) > 0:
        auto_field = time_rule.get("auto_field", [])
        if all(f in auto_field for f in ["start_time", "end_time", "repeat"]):
            start_time_dt = time_rule.get("start_time")
            end_time_dt = time_rule.get("end_time")
            if start_time_dt and end_time_dt:
                now = datetime.now().time()
                start_time = start_time_dt.time()
                end_time = end_time_dt.time()
                in_time_range = start_time <= now <= end_time if start_time <= end_time else (now >= start_time or now <= end_time)
                if in_time_range:
                    return 1 #in time frame
                else:
                    return 0 #not in time frame
    return -1 #not satisfy condition


# Auto control fan by condition
async def controlFan_by_condition(user: dict, temp_sensor_val: float, humid_sensor_val: float, device: dict):
    """
    1. Kiểm tra user có bật chế độ điều khiển theo nhiệt độ, độ ẩm ko, nếu có thực hiện tiếp
    2. Kiểm tra user có cài humidity và temperature ko
    3. Không thì dùng FAN_TEMPERATURE_THRESHOLD và FAN_HUMIDITY_THRESHOLD, Có thì dùng của người dùng
    4. Kiểm tra có vượt ngưỡng ko (temp_sensor_val > FAN_TEMPERATURE_THRESHOLD or humid_sensor_val > FAN_HUMIDITY_THRESHOLD)
    5. Nếu có, tiến hành bật quạt theo tốc độ người dùng set hoặc dùng tốc độ mặc định
    """

    rule = await db.AutomationRule.find_one({
        "user_id": user["user_id"],
        "type": "Fan"
    })

    #Nếu time frame đang chạy thì không điều khiển theo cảm biến
    if in_time_frame(rule) == 1:
        return

    if not rule or rule.get("rule_fan", "off") != "on":
        return
    
    temp_threshold = rule.get("temperature", FAN_TEMPERATURE_THRESHOLD) if "temperature" in rule.get("auto_field", []) else FAN_TEMPERATURE_THRESHOLD
    if temp_threshold is None:
        temp_threshold = FAN_TEMPERATURE_THRESHOLD

    humid_threshold = rule.get("humidity", FAN_HUMIDITY_THRESHOLD) if "humidity" in rule.get("auto_field", []) else FAN_HUMIDITY_THRESHOLD
    if humid_threshold is None:
        humid_threshold = FAN_HUMIDITY_THRESHOLD
    
    fan_level = rule.get("fan_level", FAN_AUTOSPEED) if "fan_level" in rule.get("auto_field", []) else FAN_AUTOSPEED
    if fan_level is None:
        fan_level = FAN_AUTOSPEED

    fan_status = await device_status(user["user_id"], 1)
    fan_is_on = fan_status.get("action") == 1 if fan_status else False
    current_level = fan_status.get("level") if fan_status else None

    user_id_ctx.set(user["user_id"])

    if temp_sensor_val <= temp_threshold and humid_sensor_val <= humid_threshold:
        #Nếu chưa vượt ngưỡng và quạt đang bật thì tắt quạt
        if fan_is_on:
            await turn_off_fan(ActionLog(
                device_id=1,
                action=0
            ))
    elif temp_sensor_val > temp_threshold or humid_sensor_val > humid_threshold:
        #Nếu một trong hai thông số cảm biến vượt ngưỡng thì bật quạt nếu chưa bật, thay đổi tốc độ quạt nếu tốc độ quạt hiện tại chưa đúng
        if not fan_is_on:
            await turn_on_fan(ActionLog(
                device_id=1,
                action=1
            ))

        if current_level != fan_level:
            await change_fan_speed(ActionLog(
                device_id=1,
                action=1,
                level=fan_level
            ))


# Auto control light by condition
async def controlLight_by_condition(user: dict, light_sensor_val: float, device: dict):
    """
    1. Kiểm tra user có bật chế độ điều khiển theo cường độ ánh sáng ko, nếu có thực hiện tiếp
    2. Kiểm tra user có cài light_intensity ko
    3. Không thì dùng LIGHT_INTENSITY_THRESHOLD, Có thì dùng của người dùng
    4. Kiểm tra có vượt ngưỡng ko (light_sensor_val > LIGHT_INTENSITY_THRESHOLD)
    5. Nếu có, tiến hành bật đèn theo màu và level người dùng set hoặc dùng mặc định LIGHTCOLOR_DEFAULT và LIGHTLEVEL_DEFAULT
    """

    rule = await db.AutomationRule.find_one({
        "user_id": user["user_id"],
        "type": "Light"
    })

    #Nếu time frame đang chạy thì không điều khiển theo cảm biến
    if in_time_frame(rule) == 1:
        return

    if not rule or rule.get("rule_light", "off") != "on":
        return

    threshold = rule.get("light_intensity", LIGHT_INTENSITY_THRESHOLD) if "light_intensity" in rule.get("auto_field", []) else LIGHT_INTENSITY_THRESHOLD
    if threshold is None:
        threshold = LIGHT_INTENSITY_THRESHOLD

    color = rule.get("color", LIGHTCOLOR_DEFAULT) if "color" in rule.get("auto_field", []) else LIGHTCOLOR_DEFAULT
    level = rule.get("light_level", LIGHTLEVEL_DEFAULT) if "light_level" in rule.get("auto_field", []) else LIGHTLEVEL_DEFAULT
    if color is None:
        color = LIGHTCOLOR_DEFAULT
    if level is None:
        level = LIGHTLEVEL_DEFAULT

    status = await device_status(user["user_id"], 2)
    is_on = status.get("action", 0) == 1 if status else False
    current_color = status.get("color") if status else None
    current_level = status.get("level") if status else None

    user_id_ctx.set(user["user_id"])

    if light_sensor_val >= threshold:
        #Nếu cường độ ánh sáng không thấp hơn ngưỡng, thì tắt đèn nếu nó chưa tắt
        if is_on:
            await turn_off_light(ActionLog(
                device_id=2,
                action=0
            ))
    elif light_sensor_val < threshold:
        #Nếu cường độ ánh sáng thấp hơn ngưỡng, thì bật đèn nếu chưa bật, chỉnh màu và mức nếu chúng chưa ở màu và mức đó
        if not is_on:
            await turn_on_light(ActionLog(
                device_id=2,
                action=1, 
                color=current_color,
                level=current_level
            ))
        if current_color != color:
            await change_light_color(ActionLog(
                device_id=2,
                action=1,
                color=color, 
                level=current_level

            ))
        if current_level != level:
            await change_light_level(ActionLog(
                device_id=2,
                action=1,
                color=color,
                level=level
            ))


# Auto run countdown


# Auto control by time
DATAFRAME_FLAG = False
async def control_by_time():
    """
    1. Kiểm tra tại thời điểm này có những user nào cài đặt timeframe cho device nào, 
    2. Kiểm tra trạng thái device của user, nếu bật hoặc tắt rồi thì ko tiến hành bước 3
    3. Tiến hành bật tắt device theo timeframe đó, 
    4. Giảm repeat của user xuống
    """
    global DATAFRAME_FLAG
    cursor = user_collection.find({}, {'devices': 1, 'user_id': 1, '_id': 0})
    async for user in cursor:
        user_id = user['user_id']
        for device_id in user.get('devices', []):
            device = await db.Devices.find_one({'device_id': device_id}, {'device_id': 1, 'type': 1})
            if not device:
                continue

            rule = await db.AutomationRule.find_one({
                'user_id': user_id,
                'device_id': device_id,
                'type': device['type']
            })

            if in_time_frame(rule) == -1:
                continue

            user_id_ctx.set(user_id)

            device_status_now = await device_status(user_id, device_id)

            if in_time_frame(rule) == 1:
                #Nếu trong timframe thì kiểm tra xem thiết bị bật chưa, nếu chưa thì bật và giảm repeat
                if not device_status_now or not device_status_now.get('action'):
                    if device['type'] == 'Fan':
                        await turn_on_fan(ActionLog(
                            device_id=device_id,
                            action=1
                        ))
                    elif device['type'] == 'Light':
                        await turn_on_light(ActionLog(
                            device_id=device_id,
                            action=1
                        ))
                DATAFRAME_FLAG = True

            elif in_time_frame(rule) == 0 and DATAFRAME_FLAG:
                #Nếu ngoài timeframe thì kiểm tra xem thiết bị tắt chưa, nếu chưa thì tắt
                if device_status_now and device_status_now.get('action'):
                    if device['type'] == 'Fan':
                        await turn_off_fan(ActionLog(
                            device_id=device_id,
                            action=0
                        ))
                    elif device['type'] == 'Light':
                        await turn_off_light(ActionLog(
                            device_id=device_id,
                            action=0
                        )) 
                await db.AutomationRule.update_one(
                    {'_id': rule['_id']},
                    {'$inc': {'repeat': -1}}
                ) 
                DATAFRAME_FLAG = False


# Start Agent Service
def start_agent():
    scheduler.start()
    scheduler.add_job(get_sensor_data, IntervalTrigger(seconds=10))
    scheduler.add_job(control_by_time, IntervalTrigger(minutes=1))

def shutdown_agent():
    scheduler.shutdown()