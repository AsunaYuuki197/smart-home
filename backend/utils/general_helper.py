import asyncio
import functools
import requests
from datetime import datetime, timezone, timedelta

timeRule_fields = ['start_time', 'end_time', 'repeat']
htsensorRule_fields = ['level', 'humidity', 'temperature', 'mode']
motionRule_fields = ['motion_trigger']
lightsensorRule_fields = ['color', 'light_intensity', 'level', 'mode']

# For wrap async func to sync func
def sync_wrapper(async_func):
    @functools.wraps(async_func)
    def wrapper(*args, **kwargs):
        return asyncio.run(async_func(*args, **kwargs))
    return wrapper

# For extract field from general rule to built specific rule
def extract_rule(rule: dict, keys: list[str]):
    if not rule:
        return {}

    return {k: rule[k] for k in keys} if all(rule.get(k) is not None for k in keys) else None

# For get value from feed 
def receive_feed_value(aio_key, aio_username, feed_id, endpoint):
    url = "https://io.adafruit.com/api/v2/{}/feeds/{}/data/{}".format(aio_username, feed_id, endpoint)
    params = {
        "start_time": ""
    }

    headers = {
        "X-AIO-Key": aio_key
    }

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    
    return {'error': response.status_code}


async def in_time_frame(rule: dict):
    time_rule = extract_rule(rule,timeRule_fields)
    
    if time_rule and time_rule.get("repeat", 0) > 0:
        start_time_dt = time_rule.get("start_time")
        end_time_dt = time_rule.get("end_time")
        if start_time_dt and end_time_dt:
            now = datetime.now(timezone(timedelta(hours=7))).time()
            start_time = start_time_dt.time()
            end_time = end_time_dt.time()
            in_time_range = start_time <= now <= end_time if start_time <= end_time else None
            if in_time_range:
                return 1 #in time frame
            elif now > end_time:
                return 0 #not in time frame
    return -1 #not satisfy condition