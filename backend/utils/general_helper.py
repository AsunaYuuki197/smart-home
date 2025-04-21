import asyncio
import functools
import requests
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