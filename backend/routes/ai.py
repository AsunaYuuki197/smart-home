import sys 
from pathlib import Path

sys.path.append(str(Path(__file__).parent))

from fastapi import APIRouter
from schemas.schema import ModelResponse, ModelRequest
from models.generator import Generator
from database.db import *

import bcrypt

router = APIRouter()
generator = Generator()

@router.post("/generate")
async def generate(ModelRequest: ModelRequest):
    user = await db.Users.find_one({'user_id': ModelRequest.user_id}, {'wake_word': 1})
    user_wakeword = user['wake_word']
    # Check 1st time wakeword and send wakeword token
    if user_wakeword.get('status') == "on":
        wakeword_text = user_wakeword.get('text', '').lower()
        msg_text = ModelRequest.msg.lower()

        if not ModelRequest.wakeword_token:
            if msg_text == wakeword_text:
                hashed_token = bcrypt.hashpw(msg_text.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                return ModelResponse(
                    assistant="Xin chào tôi có thể giúp gì cho bạn hôm nay",
                    calling_result=[""],
                    wakeword_token=hashed_token
                )
            else:
                return ModelResponse(
                    assistant="Bạn đang nói sai wakeword, vui lòng thử lại",
                    calling_result=[""]
                )

        # Validate wakeword token if provided
        if not bcrypt.checkpw(wakeword_text.encode('utf-8'), ModelRequest.wakeword_token.encode('utf-8')):
            return ModelResponse(
                assistant="Wakeword token sai, vui lòng thử lại",
                calling_result=[""]
            )


    try:
        response = await generator.chat(**ModelRequest.model_dump(exclude={'wakeword_token'}))
        response['wakeword_token'] = ModelRequest.wakeword_token
        return ModelResponse(**response)
    except Exception as e:
        return {"error": str(e)}