import os 
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, messaging

load_dotenv()

if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("Firebase_ServiceAccountKEY"))
    firebase_admin.initialize_app(cred)

def send_push(token: str, title: str, body: str):
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            token=token,
        )

        response = messaging.send(message)
        return response
    except Exception as e:
        return {"failure": True, "error": str(e)}