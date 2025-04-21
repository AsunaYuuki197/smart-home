from celery import Celery
from auth.auth import create_access_token
from .fcm_client import send_push
from database.db import *
from datetime import datetime, timezone
import requests

headers = {
    "ngrok-skip-browser-warning": "true",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0 Safari/537.36"
}

celery = Celery("tasks",
                broker="redis://:{}@{}:{}/0".format(os.getenv("Redis_PW"), os.getenv("Redis_HOST"), os.getenv("Redis_PORT")), 
                backend="redis://:{}@{}:{}/0".format(os.getenv("Redis_PW"), os.getenv("Redis_HOST"), os.getenv("Redis_PORT")))


@celery.task(bind=True, max_retries=3)
def send_notification(self, user, title: str, body: str, device_id: int):   
    try:
        updated_tokens = user.get("fcm_tokens", [])
        for token in user.get("fcm_tokens", []):
            res = send_push(token, title, body)

            # Check for FCM errors and clean up invalid tokens
            if res.get("failure"):
                results = res.get("results", [{}])
                error = results[0].get("error")

                if error in ["NotRegistered", "InvalidRegistration"]:
                    updated_tokens.remove(token)
        
        if not updated_tokens:
            return {"message": "Invalid Tokens"}

        headers["Authorization"] = "Bearer {}".format(create_access_token(data={"sub": str(user['user_id'])}))
        requests.post("{}update_fcmtoken".format(os.getenv("BACKEND_ENDPOINT")), 
                    json={'fcm_tokens': updated_tokens},
                    headers=headers)
        
        requests.post("{}save/notification".format(os.getenv("BACKEND_ENDPOINT")), 
                    json={
                        'device_id': device_id,
                        'message': body,
                        'timestamp': datetime.now(),
                    },
                    headers=headers)
        
        print({"message": "Notifications sent successfully"})
        return
    except Exception as e:
        raise self.retry(exc=e)

@celery.task
def countdown_finished(user_id: str):
    headers["Authorization"] = "Bearer {}".format(create_access_token(data={"sub": str(user_id)}))
    requests.post("{}autorule/save/countdown".format(os.getenv("BACKEND_ENDPOINT")), 
                  json={'status': 'off', 'time': 0},
                  headers=headers)

    return f"Countdown finished for user {user_id} at {datetime.now(timezone.utc)}"

def schedule_countdown(user_id, end_time):
    eta = end_time
    result = countdown_finished.apply_async((user_id,), eta=eta)
    return result.id
