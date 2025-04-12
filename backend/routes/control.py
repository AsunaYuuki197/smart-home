import sys 
import os
from dotenv import load_dotenv
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from fastapi import APIRouter
from schemas.schema import *
from database.db import db
from utils.control_helper import *

from Adafruit_IO import MQTTClient
from datetime import datetime
import requests

load_dotenv()
router = APIRouter()
aio = MQTTClient(os.getenv("AIO_USERNAME"), os.getenv("AIO_KEY"))
aio.connect()
aio.loop_background()

# Turn on fan
@router.post("/fan/on", summary="Turn On Fan")
async def turn_on_fan(action: ActionLog):
    """
    Bật quạt cho người dùng.\r\n

    Parameters:\r\n
    - user_id (int): ID của người dùng.\r\n
    - device_id (int): ID của thiết bị quạt (mặc định là 1).\r\n
    - action (int): Hành động, 1 để bật quạt.\r\n
    """
    action_log = action.model_dump()
    action_log['action'] = 1
    action_log['timestamp'] = datetime.now() 
    devices_id = None
    if action_log['device_id'] == "all":
        devices_id = await db.Devices.find({"type": "Fan"}, {"device_id": 1}).to_list(None)

    try:
        aio.publish(os.getenv("FAN_BTN_FEED"), 1)
        if not devices_id:
            db.ActionLog.insert_one(action_log)
        else:
            db.ActionLog.insert_many([
                list(map(lambda device: {**action_log, "device_id": device['device_id']}, devices_id))
            ])

        return "successfully"
    except Exception as e:
        return e

# Turn off fan
@router.post("/fan/off", summary="Turn Off Fan")
async def turn_off_fan(action: ActionLog):
    """
    Tắt quạt cho người dùng.\r\n
    \r\n
    Parameters:\r\n
    - user_id (int): ID của người dùng.\r\n
    - device_id (int): ID của thiết bị quạt (mặc định là 1).\r\n
    - action (int): Hành động, 0 để tắt quạt.\r\n
    """
    action_log = action.model_dump()
    action_log['action'] = 0
    action_log['timestamp'] = datetime.now() 
    devices_id = None
    if action_log['device_id'] == "all":
        devices_id = await db.Devices.find({"type": "Fan"}, {"device_id": 1}).to_list(None)

    try:
        aio.publish(os.getenv("FAN_BTN_FEED"), 0)
        if not devices_id:
            db.ActionLog.insert_one(action_log)
        else:
            db.ActionLog.insert_many([
                list(map(lambda device: {**action_log, "device_id": device['device_id']}, devices_id))
            ])

        return "successfully"
    except Exception as e:
        return e
    


# Change fan speed
@router.post("/fan/speed", summary="Change Fan Speed")
async def change_fan_speed(action: ActionLog):
    """
    Thay đổi tốc độ của quạt.\r\n
    \r\n
    Parameters:\r\n
    - user_id (int): ID của người dùng.\r\n
    - device_id (int): ID của thiết bị quạt (mặc định là 1).\r\n
    - action (int): Trạng thái của quạt, 1 để bật, 0 để tắt.\r\n
    - level (int): Tốc độ của quạt từ 1 đến 100.\r\n
    """
    action_log = action.model_dump()
    speed = action_log['level']
    action_log['timestamp'] = datetime.now()
    devices_id = None
    if speed > 100 or speed < 0 or speed is None:
        return "Speed not allowed"
    
    if action_log['device_id'] == "all":
        devices_id = await db.Devices.find({"type": "Fan"}, {"device_id": 1}).to_list(None)

    try:
        aio.publish(os.getenv("FAN_BTN_FEED"), action_log['action'])
        aio.publish(os.getenv("FAN_SPEED_FEED"), speed)

        if not devices_id:
            db.ActionLog.insert_one(action_log)
        else:
            db.ActionLog.insert_many([
                list(map(lambda device: {**action_log, "device_id": device['device_id']}, devices_id))
            ])

        return "successfully"
    except Exception as e:
        return e



# Turn on light
@router.post("/light/on", summary="Turn On Light")
async def turn_on_light(action: ActionLog):
    """
    Bật đèn cho người dùng.\r\n
    \r\n
    Parameters:\r\n
    - user_id (int): ID của người dùng.\r\n
    - device_id (int): ID của thiết bị đèn (mặc định là 2).\r\n
    - action (int): Hành động, 1 để bật đèn.\r\n
    """
    action_log = action.model_dump()
    action_log['action'] = 1
    action_log['timestamp'] = datetime.now()
    devices_id = None
    if action_log['device_id'] == "all":
        devices_id = await db.Devices.find({"type": "Light"}, {"device_id": 1}).to_list(None)

    try:
        aio.publish(os.getenv("LIGHT_BTN_FEED"), 1)

        if not devices_id:
            db.ActionLog.insert_one(action_log)
        else:
            db.ActionLog.insert_many([
                list(map(lambda device: {**action_log, "device_id": device['device_id']}, devices_id))
            ])

        return "successfully"
    except Exception as e:
        return e



# Turn off light
@router.post("/light/off", summary="Turn Off Light")
async def turn_off_light(action: ActionLog):
    """
    Tắt đèn cho người dùng.\r\n
    \r\n
    Parameters:\r\n
    - user_id (int): ID của người dùng.\r\n
    - device_id (int): ID của thiết bị đèn (mặc định là 2).\r\n
    - action (int): Hành động, 0 để tắt đèn.\r\n
    """
    action_log = action.model_dump()
    action_log['action'] = 0
    action_log['timestamp'] = datetime.now()
    devices_id = None
    if action_log['device_id'] == "all":
        devices_id = await db.Devices.find({"type": "Light"}, {"device_id": 1}).to_list(None)

    try:
        aio.publish(os.getenv("LIGHT_BTN_FEED"), 0)

        if not devices_id:
            db.ActionLog.insert_one(action_log)
        else:
            db.ActionLog.insert_many([
                list(map(lambda device: {**action_log, "device_id": device['device_id']}, devices_id))
            ])

        return "successfully"
    except Exception as e:
        return e


# Change light color
@router.post("/light/color", summary="Change Light Color")
async def change_light_color(action: ActionLog):
    """
    Thay đổi màu của đèn.\r\n
    \r\n
    Parameters:\r\n
    - user_id (int): ID của người dùng.\r\n
    - device_id (int): ID của thiết bị đèn (mặc định là 2).\r\n
    - action (int): Trạng thái của đèn, 1 để bật, 0 để tắt.\r\n
    - color (str): Màu đèn mong muốn (ví dụ: 'red', 'blue', 'green', ...).\r\n
    """
    action_log = action.model_dump()
    color = action_log['color']
    action_log['timestamp'] = datetime.now()
    devices_id = None

    color = reverse_color.get(color, color)

    if color not in support_color or color is None:
        return "Color not allowed"
    

    if action_log['device_id'] == "all":
        devices_id = await db.Devices.find({"type": "Light"}, {"device_id": 1}).to_list(None)

    try:
        aio.publish(os.getenv("LIGHT_BTN_FEED"), action_log['action'])
        aio.publish(os.getenv("LIGHT_COLOR_FEED"), color)

        if not devices_id:
            db.ActionLog.insert_one(action_log)
        else:
            db.ActionLog.insert_many([
                list(map(lambda device: {**action_log, "device_id": device['device_id']}, devices_id))
            ])

        return "successfully"
    except Exception as e:
        return e


# Change light level
@router.post("/light/level", summary="Change Light Level")
async def change_light_level(action: ActionLog):
    """
    Thay đổi độ sáng của đèn.\r\n
    \r\n
    Parameters:\r\n
    - user_id (int): ID của người dùng.\r\n
    - device_id (int): ID của thiết bị đèn (mặc định là 2).\r\n
    - action (int): Trạng thái của đèn, 1 để bật, 0 để tắt.\r\n
    - level (int): Cấp độ sáng từ 1 đến 4.\r\n
    """
    action_log = action.model_dump()
    level = action_log['level']
    action_log['timestamp'] = datetime.now()
    devices_id = None
    
    if level > 4 or level < 1:
        return "Light level not allowed"

    if action_log['device_id'] == "all":
        devices_id = await db.Devices.find({"type": "Light"}, {"device_id": 1}).to_list(None)

    try:
        aio.publish(os.getenv("LIGHT_BTN_FEED"), action_log['action'])
        aio.publish(os.getenv("LIGHT_LEVEL_FEED"), level)
        if not devices_id:
            db.ActionLog.insert_one(action_log)
        else:
            db.ActionLog.insert_many([
                list(map(lambda device: {**action_log, "device_id": device['device_id']}, devices_id))
            ])

        return "successfully"
    except Exception as e:
        return e



# Turn on pump
@router.post("/pump/on", summary="Turn On pump")
async def turn_on_pump(action: ActionLog):
    """
    Bật máy bơm cho người dùng.\r\n
    \r\n
    Parameters:\r\n
    - user_id (int): ID của người dùng.\r\n
    - device_id (int): ID của thiết bị máy bơm (mặc định là 6).\r\n
    - action (int): Hành động, 1 để bật máy bơm.\r\n
    """
    action_log = action.model_dump()
    action_log['action'] = 1
    action_log['timestamp'] = datetime.now()
    devices_id = None

    if action_log['device_id'] == "all":
        devices_id = await db.Devices.find({"type": "Pump"}, {"device_id": 1}).to_list(None)

    try:
        aio.publish(os.getenv("PUMP_FEED"), 1)

        if not devices_id:
            db.ActionLog.insert_one(action_log)
        else:
            db.ActionLog.insert_many([
                list(map(lambda device: {**action_log, "device_id": device['device_id']}, devices_id))
            ])

        return "successfully"
    except Exception as e:
        return e



# Turn off pump
@router.post("/pump/off", summary="Turn Off pump")
async def turn_off_pump(action: ActionLog):
    """
    Tắt máy bơm cho người dùng.\r\n
    \r\n
    Parameters:\r\n
    - user_id (int): ID của người dùng.\r\n
    - device_id (int): ID của thiết bị máy bơm (mặc định là 6).\r\n
    - action (int): Hành động, 0 để tắt máy bơm.\r\n
    """
    action_log = action.model_dump()
    action_log['action'] = 0
    action_log['timestamp'] = datetime.now()
    devices_id = None

    if action_log['device_id'] == "all":
        devices_id = await db.Devices.find({"type": "Pump"}, {"device_id": 1}).to_list(None)

    try:
        aio.publish(os.getenv("PUMP_FEED"), 0)

        if not devices_id:
            db.ActionLog.insert_one(action_log)
        else:
            db.ActionLog.insert_many([
                list(map(lambda device: {**action_log, "device_id": device['device_id']}, devices_id))
            ])

        return "successfully"
    except Exception as e:
        return e


# Fan statistics
@router.get("/fan/statistics", summary="Fan Usage Statistics")
async def fan_stats(user_id: int):
    """
    Retrieves statistics of fan usage.
    """
    devices_id = await db.Devices.find({"type": "Fan"}, {"device_id": 1}).to_list(None)
    fan_data = {}

    for device in devices_id:
        # Fetch all documents at once for this device in chunks
        cursor = db.ActionLog.find(
            {"user_id": user_id, "device_id": device['device_id']},
            {'_id': 0, "action": 1, "level": 1,  "timestamp": 1}
        ).batch_size(100)

        fan_data[device['device_id']] = []
        async for doc in cursor:
            fan_data[device['device_id']].append(doc)

    return fan_data    


# Light statistics
@router.get("/light/statistics", summary="Light Usage Statistics")
async def light_stats(user_id: int):
    """
    Retrieves statistics of light usage.
    """
    devices_id = await db.Devices.find({"type": "Light"}, {"device_id": 1}).to_list(None)
    light_data = {}

    for device in devices_id:
        # Fetch all documents at once for this device in chunks

        cursor = db.ActionLog.find(
            {"user_id": user_id, "device_id": device['device_id']},
            {"_id": 0, "device_id": 0, "user_id": 0}
        ).batch_size(100)

        light_data[device['device_id']] = []
        async for doc in cursor:
            light_data[device['device_id']].append(doc)



    return light_data


@router.get("/fan/usage", summary="Fan Usage Hourly Each Date")
async def fan_usage(user_id: int):
    """
    Return: \r\n
    {\r\n
        'device_id1': {\r\n
            'date_1': {\r\n
                0: ...,\r\n
                1: ...,\r\n
                ...
                23: ...,\r\n
                "all": ... # Tổng sử dụng 1 ngày\r\n
            },
            'date_2': {\r\n
                0: ...,\r\n
                1: ...,\r\n
                ...
                23: ...,\r\n
                "all": ... # Tổng sử dụng 1 ngày\r\n
            },            
            ...
        },\r\n
        'device_id2': {\r\n
            'date_1': {\r\n
                0: ...,\r\n
                1: ...,\r\n
                ...
                23: ...,\r\n
                "all": ... # Tổng sử dụng 1 ngày\r\n
            },\r\n      
            ...\r\n
        },
        ...
    }
    """

    fanStats = await fan_stats(user_id)

    fan_usage = {}

    
    for device_id in fanStats.keys():
        fan_usage[device_id] = {}
        prev_state = 0
        prev_time = None

        for action_log in fanStats[device_id]:
            timestamp = action_log["timestamp"]

            if prev_time is not None and prev_state == 1:
                duration = (timestamp - prev_time).total_seconds() / 60
                add_usage(fan_usage, device_id, prev_time, duration)

            prev_state = action_log["action"]
            prev_time = timestamp

        # Propagate "on" state if no "off" action appears within three days
        if prev_state == 1 and prev_time is not None:
            end_time = prev_time + timedelta(days=3)
            for action_log in fanStats[device_id]:
                action_timestamp = action_log["timestamp"]
                if prev_time < action_timestamp <= end_time and action_log["action"] == 0:
                    end_time = action_timestamp  # Stop propagation at the first "off" encountered
                    break
            
            duration = (end_time - prev_time).total_seconds() / 60
            add_usage(fan_usage, device_id, prev_time, duration)

    return fan_usage
        


@router.get("/light/usage", summary="Light Usage Hourly Each Date")
async def light_usage(user_id: int):
    lightStats = await light_stats(user_id)

    light_usage = {}

    
    for device_id in lightStats.keys():
        light_usage[device_id] = {}
        prev_state = 0
        prev_time = None

        for action_log in lightStats[device_id]:
            timestamp = action_log["timestamp"]

            if prev_time is not None and prev_state == 1:
                duration = (timestamp - prev_time).total_seconds() / 60
                add_usage(light_usage, device_id, prev_time, duration)

            prev_state = action_log["action"]
            prev_time = timestamp

        # Propagate "on" state if no "off" action appears within three days
        if prev_state == 1 and prev_time is not None:
            end_time = prev_time + timedelta(days=3)
            for action_log in lightStats[device_id]:
                action_timestamp = action_log["timestamp"]
                if prev_time < action_timestamp <= end_time and action_log["action"] == 0:
                    end_time = action_timestamp  # Stop propagation at the first "off" encountered
                    break
            
            duration = (end_time - prev_time).total_seconds() / 60
            add_usage(light_usage, device_id, prev_time, duration)

    return light_usage
        




# Humidity statistics
@router.get("/humid_sensor/statistics", summary="Humidity sensor statistics")
async def humid_stats(user_id: int):
    """
    Retrieves statistics of humidity sensor.
    """

    devices_id = await db.Devices.find({"type": "Humidity sensor"}, {"device_id": 1}).to_list(None)
    
    url = "https://io.adafruit.com/api/v2/{}/feeds/{}/data".format(os.getenv("AIO_USERNAME"), os.getenv("HUMIDITY_FEED"))
    params = {
        "start_time": ""
    }

    headers = {
        "X-AIO-Key": os.getenv("AIO_KEY")
    }

    for device in devices_id:
        last_time_retrieve = await db.SensorData.find_one({"user_id": user_id, "device_id": device['device_id']}, sort=[("_id", -1)])
        if last_time_retrieve is not None:
            params["start_time"] = str(last_time_retrieve["timestamp"] + timedelta(seconds=1))

        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            documents = list(map(lambda entry: {
                "user_id": user_id,
                "device_id": device['device_id'],
                "value": entry['value'],
                "timestamp": datetime.strptime(entry['created_at'], "%Y-%m-%dT%H:%M:%SZ")
            }, reversed(data)))

            if documents:
                db.SensorData.insert_many(documents)
        
        else:
            return f"Error: {response.status_code} - {response.text}"

    humid_data = []

    for device in devices_id:
        cursor = db.SensorData.find(
            {"user_id": user_id, "device_id": device['device_id']},
            {"_id": 0, "device_id": 1, "value": 1, "timestamp": 1},
        ).batch_size(100)

        async for doc in cursor:
            humid_data.append(doc)

    return humid_data



# Temperature statistics
@router.get("/temp_sensor/statistics", summary="Temperature sensor statistics")
async def temp_stats(user_id: int):
    """
    Retrieves statistics of temperature sensor.
    """

    devices_id = await db.Devices.find({"type": "Temperature sensor"}, {"device_id": 1}).to_list(None)
    
    url = "https://io.adafruit.com/api/v2/{}/feeds/{}/data".format(os.getenv("AIO_USERNAME"), os.getenv("TEMPERATURE_FEED"))
    params = {
        "start_time": 0
    }

    headers = {
        "X-AIO-Key": os.getenv("AIO_KEY")
    }

    for device in devices_id:
        last_time_retrieve = await db.SensorData.find_one({"user_id": user_id, "device_id": device['device_id']}, sort=[("_id", -1)])
        if last_time_retrieve is not None:
            params["start_time"] = str(last_time_retrieve["timestamp"] + timedelta(seconds=1))

        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
            data = response.json()
            documents = list(map(lambda entry: {
                "user_id": user_id,
                "device_id": device['device_id'],
                "value": entry['value'],
                "timestamp": datetime.strptime(entry['created_at'], "%Y-%m-%dT%H:%M:%SZ")
            }, reversed(data)))

            if documents:
                db.SensorData.insert_many(documents)
        else:
            return f"Error: {response.status_code} - {response.text}"

    temp_data = []

    for device in devices_id:
        cursor = db.SensorData.find(
            {"user_id": user_id, "device_id": device['device_id']},
            {"_id": 0, "device_id": 1, "value": 1, "timestamp": 1}
        ).batch_size(100)
        async for doc in cursor:
            temp_data.append(doc)

    return temp_data


# Device status
@router.get('/status', summary="Device status")
async def device_status(user_id: int, device_id: int):
    last_status = await db.ActionLog.find_one({"user_id": user_id, "device_id": device_id}, {"_id": 0}, sort=[("_id", -1)])
    return last_status
