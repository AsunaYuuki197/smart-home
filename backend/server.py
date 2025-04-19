import uvicorn
import subprocess
import time


def run_redis():
    try:
        result = subprocess.check_output(['docker', 'ps'], text=True)
        if 'redis' in result:
            print("Redis container already running.")
        else:
            print("Starting Redis container...")
            subprocess.run(['docker', 'run', '-d', '-p', '6379:6379', '--name', 'redis-server', 'redis:alpine'])
            time.sleep(5)
    except Exception as e:
        print(f"Failed to start Redis: {e}")

def run_celery():
    subprocess.Popen(["celery", "-A", "notification.tasks", "worker", "--loglevel=info", "--pool=gevent", "--concurrency=100"])

def run_uvicorn():
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    # run_redis() 
    run_celery()
    run_uvicorn()