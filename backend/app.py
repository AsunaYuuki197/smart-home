import sys, signal, os
from pathlib import Path
sys.path.append(str(Path(__file__).parent))


from fastapi import FastAPI
from middleware import LogMiddleware, setup_cors
from contextlib import asynccontextmanager
from routes.base import router 
from agent.agent import start_agent, shutdown_agent

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_agent()
    try:
        yield
    finally:
        shutdown_agent()
        # try:
        #     with open("celery_task", "r") as f:
        #         pid = int(f.read().strip())
        #         os.kill(pid, signal.SIGTERM)
        # except (FileNotFoundError, ValueError, ProcessLookupError) as e:
        #     print(f"[lifespan] Error terminating celery process: {e}")


app = FastAPI(lifespan=lifespan)

app.add_middleware(LogMiddleware)
setup_cors(app)
app.include_router(router)