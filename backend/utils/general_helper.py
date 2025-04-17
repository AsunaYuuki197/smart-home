import asyncio
import functools

timeRule_fields = ['start_time', 'end_time', 'repeat']
htsensorRule_fields = ['level', 'humidity', 'temperature']
motionRule_fields = ['motion_trigger']
lightsensorRule_fields = ['color', 'light_intensity', 'level']

# For wrap async func to sync func
def sync_wrapper(async_func):
    @functools.wraps(async_func)
    def wrapper(*args, **kwargs):
        return asyncio.run(async_func(*args, **kwargs))
    return wrapper

# For extract field from general rule to built specific rule
def extract_rule(rule: dict, keys: list[str]):
    return {k: rule[k] for k in keys} if all(rule.get(k) is not None for k in keys) else None
