import motor.motor_asyncio
import os 
from dotenv import load_dotenv
load_dotenv()

DB_NAME = os.getenv("DB_NAME")
DB_PWD = os.getenv("DB_PWD")

MONGO_URL = f"mongodb+srv://{DB_NAME}:{DB_PWD}@testmongodb.sovhh.mongodb.net/?retryWrites=true&w=majority&appName=TestMongodb"

try: 
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL,  maxPoolSize=20)
except Exception as e:
    print(e)
    
db = client.TestMongodb


