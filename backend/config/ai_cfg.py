import sys 

from pathlib import Path 
sys.path.append(str(Path(__file__).parent))

class LLMDataConfig:
    pass 

class LLMConfig:
    ROOT_DIR = Path(__file__).parent.parent
    MODEL_NAME = 'hiieu/Vistral-7B-Chat-function-calling'
    TOKENIZER = 'hiieu/Vistral-7B-Chat-function-calling'
    MODEL_PATH = ROOT_DIR / 'models' / 'LLMFuncCall' 
    DEVICE = 'gpu'


# Define metadata for function
FUNCTIONS_METADATA = [
    {
      "type": "function",
      "function": {
        "name": "turn_on_fan",
        "description": "Bật quạt",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "integer", "description": "ID của người dùng"},
            "device_id": {"type": "integer", "description": "ID của thiết bị quạt, mặc định là 1"},
            "action": {"type": "integer", "description": "0 = Tắt, 1 = Bật"}
          },
          "required": ["user_id", "device_id", "action"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "turn_off_fan",
        "description": "Tắt quạt",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "integer", "description": "ID của người dùng"},
            "device_id": {"type": "integer", "description": "ID của thiết bị quạt, mặc định là 1"},
            "action": {"type": "integer", "description": "0 = Tắt, 1 = Bật"}
          },
          "required": ["user_id", "device_id", "action"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "change_fan_speed",
        "description": "Thay đổi tốc độ của quạt",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "integer", "description": "ID của người dùng"},
            "device_id": {"type": "integer", "description": "ID của thiết bị quạt, mặc định là 1"},
            "action": {"type": "integer", "description": "Trạng thái của quạt, 0 = Tắt, 1 = Bật"},
            "level": {"type": "integer", "description": "Tốc độ của quạt từ 1 đến 100"}
          },
          "required": ["user_id", "device_id", "action", "level"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "turn_on_light",
        "description": "Bật đèn",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "integer", "description": "ID của người dùng"},
            "device_id": {"type": "integer", "description": "ID của thiết bị đèn, mặc định là 2"},
            "action": {"type": "integer", "description": "0 = Tắt, 1 = Bật"}
          },
          "required": ["user_id", "device_id", "action"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "turn_off_light",
        "description": "Tắt đèn",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "integer", "description": "ID của người dùng"},
            "device_id": {"type": "integer", "description": "ID của thiết bị đèn, mặc định là 2"},
            "action": {"type": "integer", "description": "0 = Tắt, 1 = Bật"}
          },
          "required": ["user_id", "device_id", "action"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "change_light_color",
        "description": "Thay đổi màu đèn",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "integer", "description": "ID của người dùng"},
            "device_id": {"type": "integer", "description": "ID của thiết bị đèn, mặc định là 2"},
            "action": {"type": "integer", "description": "Trạng thái của đèn, 0 = Tắt, 1 = Bật"},
            "color": {"type": "string", "description": "Màu đèn mong muốn"}
          },
          "required": ["user_id", "device_id", "action", "color"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "change_light_level",
        "description": "Thay đổi độ sáng của đèn",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "integer", "description": "ID của người dùng"},
            "device_id": {"type": "integer", "description": "ID của thiết bị đèn, mặc định là 2"},
            "action": {"type": "integer", "description": "Trạng thái của đèn, 0 = Tắt, 1 = Bật"},
            "level": {"type": "integer", "description": "Cấp độ sáng của đèn từ 1 đến 4"}
          },
          "required": ["user_id", "device_id", "action", "level"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "turn_on_pump",
        "description": "Bật máy bơm",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "integer", "description": "ID của người dùng"},
            "device_id": {"type": "integer", "description": "ID của thiết bị máy bơm, mặc định là 6"},
            "action": {"type": "integer", "description": "0 = Tắt, 1 = Bật"}
          },
          "required": ["user_id", "device_id", "action"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "turn_off_pump",
        "description": "Tắt máy bơm",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "integer", "description": "ID của người dùng"},
            "device_id": {"type": "integer", "description": "ID của thiết bị máy bơm, mặc định là 6"},
            "action": {"type": "integer", "description": "0 = Tắt, 1 = Bật"}
          },
          "required": ["user_id", "device_id", "action"]
        }
      }
    }
]