import sys
import torch
import re, json


from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from utils.logger import Logger
from config.ai_cfg import *
from .model import LLM_FuncCall
from routes.control import *

LOGGER = Logger(__file__, log_file="generator.log")
LOGGER.log.info("Starting Model Serving")

class Generator:
    def __init__(self):
        self.LLM_FuncCall = LLM_FuncCall()

    async def chat(self, user_id: int, message: str):
        conversation = [
            {"role": "system", "content": f"""Bạn là một trợ lý hữu ích có quyền truy cập vào các chức năng sau. Sử dụng chúng nếu cần -\n{str(FUNCTIONS_METADATA)} Để sử dụng các chức năng này, hãy phản hồi với:\n<functioncall> {{\\"name\\": \\"function_name\\", \\"arguments\\": {{\\"arg_1\\": \\"value_1\\", \\"arg_1\\": \\"value_1\\", ...}} }} </functioncall>\n\nTrường hợp đặc biệt bạn phải xử lý:\n - Nếu không có chức năng nào khớp với yêu cầu của người dùng, bạn sẽ phản hồi một cách lịch sự rằng bạn không thể giúp được. \n - Nếu không biết truyền giá trị nào cho tham số, hãy sử dụng giá trị mặc định trong description \n - Chọn chức năng có thể nhận nhiều nhất tham số mà người dùng yêu cầu""" },
            {"role": "user", "content": f"user_id của tôi là {user_id}, {message}"}, # user input
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

        return {"assistant": assistant, "calling_result": calling_result if calling_result == "successfully" else "Try again"}
    

    async def call_function(self, assistant: str):
        match = re.search(r'<functioncall> (.*?) </functioncall>', assistant)
        if match:
            try:
                function_data = match.group(1)
                function_dict = json.loads(function_data.replace("'", ""))

                target_function = function_dict["name"]
                arguments = function_dict["arguments"]

                dispatch_table = {
                    "turn_on_fan": turn_on_fan,
                    "turn_off_fan": turn_off_fan,
                    "change_fan_speed": change_fan_speed,
                    "turn_on_light": turn_on_light,
                    "turn_off_light": turn_off_light,
                    "change_light_color": change_light_color,
                    "change_light_level": change_light_level,
                    "turn_on_pump": turn_on_pump,
                    "turn_off_pump": turn_off_pump
                }

                if target_function not in dispatch_table:
                    raise ValueError(f"Function '{target_function}' not found in mapping")

                try:
                    result = dispatch_table[target_function](**arguments)
                except TypeError as e:
                    raise ValueError(f"Parameter error when calling {target_function}: {e}")
                
                return result
            
            except Exception as e:
                raise ValueError(f"Error processing function call: {e}")
            
        else:
            raise ValueError("Not function call")
    
    
