from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from config.general_cfg import *
from routes.control import *
from routes.autorule import *
from utils.general_helper import receive_feed_value
from notification.tasks import send_notification
import asyncio, time
from utils.logger import Logger


LOGGER = Logger(__file__,log_file="agent.log")

scheduler = AsyncIOScheduler()

# Auto sent notify and control based on condition
async def get_sensor_data():
    start_time = time.time()

    cursor = user_collection.find({}, {'devices': 1, 'user_id': 1, 'noti': 1, '_id': 0})
    async for user in cursor:

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
                asyncio.create_task(hot_alarm(user,float(temp_sensor['value'])))
            elif device['type'] == "Humidity sensor":
                humid_sensor = receive_feed_value(os.getenv("AIO_KEY"), os.getenv("AIO_USERNAME"), os.getenv("HUMIDITY_FEED"), "last")     

            asyncio.create_task(controlFan_by_condition(user,float(temp_sensor['value']),float(humid_sensor['value']),device))

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
    
    send_notification.apply_async(args=[user, "Cháy rồi bro ơi 😭😭", "Máy bơm đang hoạt động để dập lửa, mau gọi cứu hỏa đi ..."])
    user_id_ctx.set(user['user_id'])
    await turn_on_pump(ActionLog(
        device_id=device['device_id'],
        action=1
    ))

    return


async def hot_alarm(user: dict, temp_sensor_val: float):
    if user['noti'].get('hot_notif', "off") == "off":
        return

    if temp_sensor_val < user['noti']['temp']:
        return 
    
    send_notification.apply_async(args=[user, "Nóng quá 🥵🥵", "Bạn có muốn bật quạt không :)))"])
    
    return


# Auto control fan by condition
async def controlFan_by_condition(user: dict, temp_sensor_val: float, humid_sensor_val: float, device: dict):
    """
    1. Kiểm tra user có bật chế độ điều khiển theo nhiệt độ, độ ẩm ko, nếu có thực hiện tiếp
    2. Kiểm tra user có cài humidity và temperature ko
    3. Không thì dùng FAN_TEMPERATURE_THRESHOLD và FAN_HUMIDITY_THRESHOLD, Có thì dùng của người dùng
    4. Kiểm tra có vượt ngưỡng ko (temp_sensor_val > FAN_TEMPERATURE_THRESHOLD or humid_sensor_val > FAN_HUMIDITY_THRESHOLD)
    5. Nếu có, tiến hành bật quạt theo tốc độ người dùng set hoặc dùng tốc độ mặc định
    """
    
    pass


# Auto control light by condition
async def controlLight_by_condition(user: dict, light_sensor_val: float, device: dict):
    """
    1. Kiểm tra user có bật chế độ điều khiển theo cường độ ánh sáng ko, nếu có thực hiện tiếp
    2. Kiểm tra user có cài light_intensity ko
    3. Không thì dùng LIGHT_INTENSITY_THRESHOLD, Có thì dùng của người dùng
    4. Kiểm tra có vượt ngưỡng ko (light_sensor_val > LIGHT_INTENSITY_THRESHOLD)
    5. Nếu có, tiến hành bật đèn theo màu và level người dùng set hoặc dùng mặc định LIGHTCOLOR_DEFAULT và LIGHTLEVEL_DEFAULT
    """

    pass

# Auto control pump


# Auto receive sensor data


# Auto run countdown


# Auto control by time
async def control_by_time():
    """
    1. Kiểm tra tại thời điểm này có những user nào cài đặt timeframe cho device nào, 
    2. Kiểm tra trạng thái device của user, nếu bật hoặc tắt rồi thì ko tiến hành bước 3
    3. Tiến hành bật tắt device theo timeframe đó, 
    4. Giảm repeat của user xuống
    """
    
    pass


# Start Agent Service
def start_agent():
    scheduler.start()
    scheduler.add_job(get_sensor_data, IntervalTrigger(seconds=10))
    scheduler.add_job(control_by_time, IntervalTrigger(minutes=1))

def shutdown_agent():
    scheduler.shutdown()
