import sys
import torch


from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from utils.logger import Logger
from config.ai_cfg import *
from .model import LLM_FuncCall

LOGGER = Logger(__file__, log_file="generator.log")
LOGGER.log.info("Starting Model Serving")

class Generator:
    def __init__(self):
        self.LLM_FuncCall = LLM_FuncCall()

    async def chat(self, message):
        conversation = [
            {"role": "system", "content": f"""Bạn là một trợ lý hữu ích có quyền truy cập vào các chức năng sau. Sử dụng chúng nếu cần -\n{str(functions_metadata)} Để sử dụng các chức năng này, hãy phản hồi với:\n<functioncall> {{\\"name\\": \\"function_name\\", \\"arguments\\": {{\\"arg_1\\": \\"value_1\\", \\"arg_1\\": \\"value_1\\", ...}} }} </functioncall>\n\nTrường hợp đặc biệt bạn phải xử lý:\n - Nếu không có chức năng nào khớp với yêu cầu của người dùng, bạn sẽ phản hồi một cách lịch sự rằng bạn không thể giúp được.""" },
            {"role": "user", "content": f"{message}"}, # user input
        ]

        input_ids = self.LLM_FuncCall.tokenizer.apply_chat_template(conversation, return_tensors="pt").to(self.device)

        out_ids = self.LLM_FuncCall.model.generate(
            input_ids=input_ids,
            max_new_tokens=50,
            do_sample=True,
            top_p=0.9,
            top_k=50,
            temperature=0.7,
            repetition_penalty=1.1,
            pad_token_id= self.LLM_FuncCall.tokenizer.eos_token_id,
            num_beams=1,      
            use_cache=True,
        )


        assistant = self.LLM_FuncCall.tokenizer.batch_decode(out_ids[:, input_ids.size(1): ], skip_special_tokens=True)[0].strip()
        calling_result = self.call_function(assistant)

        LOGGER.log_model(LLMConfig.MODEL_NAME)
        LOGGER.log_response(assistant, calling_result)

        torch.cuda.empty_cache()

        return calling_result if calling_result == "successfully" else "Try again"
    
    
