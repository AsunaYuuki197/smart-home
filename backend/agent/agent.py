from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from config.general_cfg import *
from routes.control import *
from routes.autorule import *
from utils.general_helper import *
from background.tasks import send_notification
import asyncio, time
from utils.logger import Logger
from utils.redis_service import is_paused, set_dataframe_flag, get_dataframe_flag


LOGGER = Logger(__file__,log_file="agent.log")

scheduler = AsyncIOScheduler()

# Auto sent notify and control based on condition
async def get_sensor_data():
    start_time = time.time()

    cursor = user_collection.find({}, {'fcm_tokens':1,'devices': 1, 'user_id': 1, 'noti': 1, '_id': 0, 'email': 1})
    async for user in cursor:
        temp_sensor = {'value': float('inf')}
        humid_sensor = {'value': float('inf')}
        for device_id in user.get('devices', []):
            device = await db.Devices.find_one({"device_id": device_id}, {'device_id':1 , 'type': 1})
            if not device:
                continue
            if device['type'] == "Light sensor":
                light_sensor = receive_feed_value(os.getenv("AIO_KEY"), os.getenv("AIO_USERNAME"), os.getenv("LIGHT_SENSOR_FEED"), "last")   
                asyncio.create_task(controlLight_by_condition(user,float(light_sensor['value']),device))
            elif device['type'] == "Temperature sensor":   
                temp_sensor = receive_feed_value(os.getenv("AIO_KEY"), os.getenv("AIO_USERNAME"), os.getenv("TEMPERATURE_FEED"), "last")   
                asyncio.create_task(fire_alarm(user,float(temp_sensor['value']),device))
                asyncio.create_task(hot_alarm(user,float(temp_sensor['value']), device))
            elif device['type'] == "Humidity sensor":
                humid_sensor = receive_feed_value(os.getenv("AIO_KEY"), os.getenv("AIO_USERNAME"), os.getenv("HUMIDITY_FEED"), "last")     
            
            if float(temp_sensor['value']) < float('inf') and float(humid_sensor['value']) < float('inf'):
                asyncio.create_task(controlFan_by_condition(user,float(temp_sensor.get('value')),float(humid_sensor.get('value')),device))

    process_time = time.time() - start_time

    next_run = datetime.now() + timedelta(seconds=10)
    print("Jobs executed successfully")
    try:
        LOGGER.log.info(
            f'Job "get_sensor_data (trigger: interval[10 seconds], '
            f'next run at: {next_run.strftime("%Y-%m-%d %H:%M:%S")})" '
            f'executed successfully - {process_time:.2f}s'
        )
    except:
        return

async def fire_alarm(user: dict, temp_sensor_val: float, device):
    if user['noti']['status'] == "off":
        return
    
    if temp_sensor_val < FIRE_ALARM_THRESHOLD:
        user_id_ctx.set(user['user_id'])
        pump_last = await device_status(6)
        if pump_last is None or not pump_last.get('action'):
            return

        user_id_ctx.set(user['user_id'])
        await turn_off_pump(ActionLog(
            device_id=6,
            action=0
        ))
        return 
    
    send_notification.apply_async(args=[user, "Cháy rồi bro ơi 😭😭", "Máy bơm đang hoạt động để dập lửa, mau gọi cứu hỏa đi ...", device['device_id']])
    user_id_ctx.set(user['user_id'])
    await turn_on_pump(ActionLog(
        device_id=6,
        action=1
    ))
    print("Fire alarm executed successfully")
    return


async def hot_alarm(user: dict, temp_sensor_val: float, device: dict):
    if user['noti'].get('hot_notif', "off") == "off":
        return
    if temp_sensor_val < user['noti']['temp']:
        return 
    
    send_notification.apply_async(args=[user, "Nóng quá 🥵🥵", "Bạn có muốn bật quạt không !!!!", device['device_id']])
    print("Hot alarm executed successfully")

    return


# Auto control fan by condition
async def controlFan_by_condition(user: dict, temp_sensor_val: float, humid_sensor_val: float, device: dict):

    rule = await db.AutomationRule.find_one({
        "user_id": user["user_id"],
        "type": "Fan"
    })

    # Nếu time frame đang chạy thì không điều khiển theo cảm biến
    if await in_time_frame(rule) != -1:
        print("In Timeframe, Not control fan by condition")
        return

    fan_rule = extract_rule(rule, htsensorRule_fields)
    if not fan_rule:
        print("There is no Fan Rule")
        return    

    temp_threshold = fan_rule.get("temperature", FAN_TEMPERATURE_THRESHOLD)
    humid_threshold = fan_rule.get("humidity", FAN_HUMIDITY_THRESHOLD)
    fan_level = fan_rule.get("fan_level", FAN_AUTOSPEED)
    user_id_ctx.set(user['user_id'])
    fan_status = await device_status(1)
    fan_is_on = fan_status.get("action") == 1 if fan_status else False
    current_level = fan_status.get("level") if fan_status else None

    user_id_ctx.set(user["user_id"])

    if await is_paused(user['user_id']):
        print("Auto mode is pausing")
        return 
    
    if temp_sensor_val <= temp_threshold and humid_sensor_val > humid_threshold:
        # Nếu chưa vượt ngưỡng và quạt đang bật thì tắt quạt
        if fan_is_on:
            await turn_off_fan(ActionLog(
                device_id=1,
                action=0,
                command_mode="auto",
            ))
            print("Turn off Fan By Condition Successfully")
    elif temp_sensor_val > temp_threshold or humid_sensor_val <= humid_threshold:
        # Nếu một trong hai thông số cảm biến vượt ngưỡng thì bật quạt nếu chưa bật, thay đổi tốc độ quạt nếu tốc độ quạt hiện tại chưa đúng
        if not fan_is_on:
            await turn_on_fan(ActionLog(
                device_id=1,
                action=1,
                command_mode="auto",
            ))

        if current_level != fan_level:
            await change_fan_speed(ActionLog(
                device_id=1,
                action=1,
                level=fan_level,
                command_mode="auto",
            ))

        print("Turn On Fan By Condition Successfully")

    print("Temp sensor val: ", temp_sensor_val, "Temp threshold: ", temp_threshold, "Humid sensor val: ", humid_sensor_val, "Humid Threshold", humid_threshold)

# Auto control light by condition
async def controlLight_by_condition(user: dict, light_sensor_val: float, device: dict):

    rule = await db.AutomationRule.find_one({
         "user_id": user["user_id"],
         "type": "Light"
     })
 
    # Nếu time frame đang chạy thì không điều khiển theo cảm biến
    if await in_time_frame(rule) != -1:
        print("In Timeframe, Not control light by condition")
        return

    light_rule = extract_rule(rule, lightsensorRule_fields)
    if not light_rule:
        print("There is no Light Rule")
        return

    threshold = light_rule.get("light_intensity", LIGHT_INTENSITY_THRESHOLD)

    color = light_rule.get("color", LIGHTCOLOR_DEFAULT) 
    level = light_rule.get("light_level", LIGHTLEVEL_DEFAULT)
    user_id_ctx.set(user['user_id'])
    status = await device_status(2)
    is_on = status.get("action", 0) == 1 if status else False
    current_color = status.get("color") if status else None
    current_level = status.get("level") if status else None

    user_id_ctx.set(user["user_id"])

    if await is_paused(user['user_id']):
        print("Auto mode is pausing")
        return

    if light_sensor_val >= threshold:
        # Nếu cường độ ánh sáng không thấp hơn ngưỡng, thì tắt đèn nếu nó chưa tắt
        if is_on:
            await turn_off_light(ActionLog(
                device_id=2,
                action=0,
                command_mode="auto",
            ))
            print("Turn Off Light By Condition Successfully")

    elif light_sensor_val < threshold:
        # Nếu cường độ ánh sáng thấp hơn ngưỡng, thì bật đèn nếu chưa bật, chỉnh màu và mức nếu chúng chưa ở màu và mức đó
        if not is_on:
            await turn_on_light(ActionLog(
                device_id=2,
                action=1, 
                color=current_color,
                level=current_level,
                command_mode="auto",
            ))

        if current_color != color:
            await change_light_color(ActionLog(
                device_id=2,
                action=1,
                color=color, 
                level=current_level,
                command_mode="auto",
            ))
        if current_level != level:
            await change_light_level(ActionLog(
                device_id=2,
                action=1,
                color=color,
                level=level,
                command_mode="auto",
            ))

        print("ControlLight By Condition Successfully")

    print("Light sensor val: ", light_sensor_val, "Light threshold: ", threshold)


# Auto control by time
async def control_by_time():
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

            if await in_time_frame(rule) == -1:
                print("Timerule is None or repeat = 0")
                continue

            user_id_ctx.set(user_id)

            device_status_now = await device_status(device_id)
            
            if await is_paused(user_id):
                print("Auto mode is pausing")
                continue

            if await in_time_frame(rule) == 1:
                # Nếu trong timeframe thì kiểm tra xem thiết bị bật chưa, nếu chưa thì bật và giảm repeat
                if not device_status_now or not device_status_now.get('action'):
                    if device['type'] == 'Fan':
                        await turn_on_fan(ActionLog(
                            device_id=device_id,
                            action=1,
                            command_mode="auto",
                        ))
                        print("In timeframe, Turn on fan")
                    elif device['type'] == 'Light':
                        await turn_on_light(ActionLog(
                            device_id=device_id,
                            action=1,
                            command_mode="auto",
                        ))
                        print("In timeframe, Turn on light")


                await set_dataframe_flag(user_id, device_id, 1)

            elif await in_time_frame(rule) == 0 and await get_dataframe_flag(user_id, device_id):
                # Nếu ngoài timeframe thì kiểm tra xem thiết bị tắt chưa, nếu chưa thì tắt
                if device_status_now and device_status_now.get('action'):
                    if device['type'] == 'Fan':
                        await turn_off_fan(ActionLog(
                            device_id=device_id,
                            action=0,
                            command_mode="auto",
                        ))
                        print("Out timeframe, Turn off fan")

                    elif device['type'] == 'Light':
                        await turn_off_light(ActionLog(
                            device_id=device_id,
                            action=0,
                            command_mode="auto"
                        )) 
                        print("Out timeframe, Turn off fan")

                await db.AutomationRule.update_one(
                    {'_id': rule['_id']},
                    {'$inc': {'repeat': -1}}
                ) 
                print("Decreased the repeat")
                await set_dataframe_flag(user_id, device_id, 0)


# Start Agent Service
def start_agent():
    scheduler.start()
    scheduler.add_job(get_sensor_data, IntervalTrigger(seconds=15), max_instances=1, misfire_grace_time=2)
    scheduler.add_job(control_by_time, IntervalTrigger(seconds=5), max_instances=1, misfire_grace_time=5)

def shutdown_agent():
    scheduler.shutdown()