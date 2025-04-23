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
    return subprocess.Popen(["celery", "-A", "background.tasks", "worker", "--loglevel=info", "--pool=gevent", "--concurrency=100"])

def run_uvicorn():
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    # run_redis() 
    celery_task = run_celery()
    time.sleep(10)
    with open('celery_task', 'w') as fp:
        fp.write(str(celery_task.pid))
    run_uvicorn()