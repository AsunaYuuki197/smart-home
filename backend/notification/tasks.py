from celery import Celery
from .fcm_client import send_push
from database.db import *
celery = Celery("tasks",
                broker="redis://:{}@{}:{}/0".format(os.getenv("Redis_PW"), os.getenv("Redis_HOST"), os.getenv("Redis_PORT")), 
                backend="redis://:{}@{}:{}/0".format(os.getenv("Redis_PW"), os.getenv("Redis_HOST"), os.getenv("Redis_PORT")))

@celery.task(bind=True, max_retries=3)
def send_notification(self, user, title: str, body: str):   
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

        db.Users.update_one(
            {"user_id": user['user_id']},
            {"$set": {"fcm_tokens": updated_tokens}},
        )

        print({"message": "Notifications sent successfully"})
        return
    except Exception as e:
        raise self.retry(exc=e)
