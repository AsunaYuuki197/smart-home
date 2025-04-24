import redis.asyncio as redis
from dotenv import load_dotenv
import os 
load_dotenv()

redis_client = redis.from_url("redis://:{}@{}:{}/0".format(os.getenv("Redis_PW"), os.getenv("Redis_HOST"), os.getenv("Redis_PORT")))

def redis_key(user_id: str) -> str:
    return f"user:{user_id}:auto_paused"

def redis_pair_key(user_id: str, device_id: str) -> str:
    return f"user:{user_id}:device:{device_id}"

# Pause automode
async def pause_user(user_id: str):
    await redis_client.set(redis_key(user_id), "true")

# Resume automode
async def resume_user(user_id: str):
    await redis_client.set(redis_key(user_id), "false")

# Check automode is paused
async def is_paused(user_id: str) -> bool:
    paused = await redis_client.get(redis_key(user_id))
    return paused == "true"

# Set DATAFRAME_FLAG/ 1st time turn off/on
async def set_dataframe_flag(user_id: str, device_id: str, dataframe_flag: int):
    await redis_client.set(redis_pair_key(user_id, device_id), dataframe_flag)

# Set DATAFRAME_FLAG
async def get_dataframe_flag(user_id: str, device_id: str):
    dataframe_flag = await redis_client.get(redis_pair_key(user_id, device_id))
    return dataframe_flag