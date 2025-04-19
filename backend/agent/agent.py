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

# Auto sent notify
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
            elif device['type'] == "Temperature sensor":
                temp_sensor = receive_feed_value(os.getenv("AIO_KEY"), os.getenv("AIO_USERNAME"), os.getenv("TEMPERATURE_FEED"), "last")   
                asyncio.create_task(fire_alarm(user,float(temp_sensor['value']),device))
                asyncio.create_task(hot_alarm(user,float(temp_sensor['value'])))
            elif device['type'] == "Humidity sensor":
                humid_sensor = receive_feed_value(os.getenv("AIO_KEY"), os.getenv("AIO_USERNAME"), os.getenv("HUMIDITY_FEED"), "last")     

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
    if user['noti']['hot_notif'] == "off":
        return

    if temp_sensor_val < user['noti']['temp']:
        return 
    
    send_notification.apply_async(args=[user, "Nóng quá 🥵🥵", "Bạn có muốn bật quạt không :)))"])
    
    return


# Auto control fan


# Auto control light


# Auto control pump


# Auto receive sensor data


# Auto run countdown


# Start Agent Service
def start_agent():
    scheduler.start()
    scheduler.add_job(get_sensor_data, IntervalTrigger(seconds=10))


def shutdown_agent():
    scheduler.shutdown()
