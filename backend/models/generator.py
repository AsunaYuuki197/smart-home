import sys
import torch
import re, orjson
from google import genai
from google.genai import types
from dotenv import load_dotenv

from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from utils.logger import Logger
from config.ai_cfg import *
from .model import LLM_FuncCall
from routes.control import *
from utils.general_helper import *

load_dotenv()
LOGGER = Logger(__file__, log_file="generator.log")
LOGGER.log.info("Starting Model Serving")
client = genai.Client(api_key=os.getenv("GEMINI_KEY"))

class Generator:

    def __init__(self):
        self.LLM_FuncCall = LLM_FuncCall()
        self.tools = [turn_on_fan,turn_off_fan,change_fan_speed,turn_on_light,turn_off_light,change_light_color,change_light_level,turn_on_pump,turn_off_pump]
        # self.gemini_tools = [types.Tool(function_declarations=[FUNC['function'] for FUNC in FUNCTIONS_METADATA])]
        self.gemini_tool_example = [
            types.Tool(
                function_declarations=[
                    types.FunctionDeclaration(
                        name="getWeather",
                        description="gets the weather for a requested city",
                        parameters=genai.types.Schema(
                            type = genai.types.Type.OBJECT,
                            properties = {
                                "city": genai.types.Schema(
                                    type = genai.types.Type.STRING,
                                ),
                            },
                        ),
                    ),
                ])
        ]
        self.dispatch_table = {tool.__name__: tool for tool in self.tools}

    async def chat(self, user_id: int, msg: str, model_name: str):
        conversation = [
            {
                "role": "system",
                "content": f"""Bạn là một trợ lý hữu ích có quyền truy cập vào các chức năng sau. Sử dụng chúng nếu cần -
        {str(FUNCTIONS_METADATA)}
        Để sử dụng các chức năng này, hãy phản hồi với:
        <functioncall> {{"name": "function_name", "arguments": {{"arg_1": "value_1", "arg_2": "value_2", ...}} }} </functioncall>

        Trường hợp đặc biệt bạn phải xử lý:
        - Nếu không có chức năng nào khớp với yêu cầu của người dùng, hãy trả lời một cách lịch sự rằng bạn không thể giúp được.
        - Nếu không biết truyền giá trị nào cho tham số, hãy sử dụng giá trị mặc định như đã nêu trong phần mô tả của tham số.
        - Chọn chức năng có thể nhận nhiều tham số nhất phù hợp với yêu cầu của người dùng.
        - Nếu không tìm thấy 'device_id', hãy sử dụng giá trị mặc định theo mô tả (ví dụ: 1 cho quạt, 2 cho đèn, 6 cho máy bơm).
        - Nếu không tìm thấy 'action', sử dụng giá trị mặc định: 1 cho bật và 0 cho tắt.
        """
            },
            {"role": "user", "content": f"user_id của tôi là {user_id}, {msg}"},
        ]


        if model_name in ['gemini-2.5-pro-preview-03-25','gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash-8b']: # Add more Gemini Model
            self.LLM_FuncCall = client.chats.create(
                model=model_name,
                config=genai.types.GenerateContentConfig(
                    # tools=[sync_wrapper(tool) for tool in self.tools],
                    tools=self.gemini_tool_example,
                    system_instruction=SMARTHOME_BOT,
                ),
            )
            
            assistant = self.LLM_FuncCall.send_message(message=f"user_id của tôi là {user_id}, Thực hiện lệnh sau: {msg}")

            calling_results = await self.call_function(assistant.function_calls)     
            LOGGER.log_model(model_name)
            LOGGER.log_response(str(assistant), str(calling_results))

            final_response = self.LLM_FuncCall.send_message(
                message=calling_results,
            )
            return {"assistant": final_response.text, "calling_result": ["Successfully" if r.function_response.response.get('result') == "successfully" else "Try again" for r in calling_results]}
        
        if model_name != LLMConfig.MODEL_NAME:
            LLMConfig.MODEL_NAME = model_name
            LLMConfig.TOKENIZER = model_name
            self.LLM_FuncCall = LLM_FuncCall()


        try:
            input_ids = self.LLM_FuncCall.tokenizer.apply_chat_template(conversation, return_tensors="pt").to(LLMConfig.DEVICE)

            out_ids = self.LLM_FuncCall.model.generate(
                input_ids=input_ids,
                max_new_tokens=100,
                do_sample=True,
                top_p=0.9,
                top_k=50,
                temperature=0.7,
                repetition_penalty=1.1,
                pad_token_id= self.LLM_FuncCall.tokenizer.eos_token_id,
                num_beams=1,      
                use_cache=True,
            )
        except:
            return {"assistant": assistant, "calling_result": "Try again with another model"}
            

        assistant = self.LLM_FuncCall.tokenizer.batch_decode(out_ids[:, input_ids.size(1): ], skip_special_tokens=True)[0].strip()

        calling_results = await self.call_function(await self.process_command(assistant))

        LOGGER.log_model(LLMConfig.MODEL_NAME)
        LOGGER.log_response(assistant, str(calling_results))

        torch.cuda.empty_cache()

        return {"assistant": assistant, "calling_result": ["Successfully" if r.function_response.response.get('result') == "successfully" else "Try again" for r in calling_results]}
    


    async def call_function(self, function_calls):
        try:
            results = []
            for fn in function_calls:
                if fn.name not in self.dispatch_table:
                    raise ValueError(f"Function '{fn.name}' not found in mapping")

                try:                    
                    result = await self.dispatch_table[fn.name](ActionLog(**fn.args))
                    results.append(types.Part.from_function_response(name=fn.name,response={"result": result}))
                except TypeError as e:
                    raise ValueError(f"Parameter error when calling {fn.name}: {e}")

            return results
    
        except Exception as e:
            raise ValueError(f"Error processing function call: {e}")
    
    
    async def process_command(self, assistant: str):
        pattern = re.compile(r"<functioncall>\s*(.*?)\s*</functioncall>", flags=re.DOTALL)
        function_calls = []

        for match in pattern.finditer(assistant):
            raw = match.group(1).strip()

            try:
                outer = orjson.loads(raw.replace("'", ""))

                func_name = outer.get("name")
                arguments = outer.get("arguments")

                if func_name and arguments:
                    function_calls.append(types.FunctionCall(name=func_name,args=arguments))

            except orjson.JSONDecodeError:
                continue 

        return function_calls