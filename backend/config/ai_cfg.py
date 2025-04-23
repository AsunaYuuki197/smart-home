import sys 

from pathlib import Path 
sys.path.append(str(Path(__file__).parent))

import torch 
from transformers import BitsAndBytesConfig


class LLMDataConfig:
    pass 

class LLMConfig:
    ROOT_DIR = Path(__file__).parent.parent
    MODEL_NAME = 'hiieu/Vistral-7B-Chat-function-calling'
    TOKENIZER = 'hiieu/Vistral-7B-Chat-function-calling'
    MODEL_PATH = ROOT_DIR / 'models' / 'LLMFuncCall' 
    DEVICE = 'cuda'
    quantization_config = BitsAndBytesConfig(
        load_in_8bit=True,
        bnb_8bit_quant_type="nf8",
        bnb_8bit_compute_dtype=torch.float16,
    )    

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
            "user_id": {
                "type": "integer",
                "description": "ID của người dùng"
            },
            "device_id": {
                "type": "integer",
                "description": "ID của thiết bị quạt, mặc định là 1"
            },
            "action": {
                "type": "integer",
                "description": "0 = Tắt, 1 = Bật"
            }
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
            "user_id": {
                "type": "integer",
                "description": "ID của người dùng"
            },
            "device_id": {
                "type": "integer",
                "description": "ID của thiết bị quạt, mặc định là 1"
            },
            "action": {
                "type": "integer",
                "description": "0 = Tắt, 1 = Bật"
            }
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
            "user_id": {
                "type": "integer",
                "description": "ID của người dùng"
            },
            "device_id": {
                "type": "integer",
                "description": "ID của thiết bị quạt, mặc định là 1"
            },
            "action": {
                "type": "integer",
                "description": "Trạng thái của quạt, 0 = Tắt, 1 = Bật"
            },
            "level": {
                "type": "integer",
                "description": "Tốc độ của quạt từ 1 đến 100"
            }
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
            "user_id": {
                "type": "integer",
                "description": "ID của người dùng"
            },
            "device_id": {
                "type": "integer",
                "description": "ID của thiết bị đèn, mặc định là 2"
            },
            "action": {
                "type": "integer",
                "description": "0 = Tắt, 1 = Bật"
            }
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
            "user_id": {
                "type": "integer",
                "description": "ID của người dùng"
            },
            "device_id": {
                "type": "integer",
                "description": "ID của thiết bị đèn, mặc định là 2"
            },
            "action": {
                "type": "integer",
                "description": "0 = Tắt, 1 = Bật"
            }
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
            "user_id": {
                "type": "integer",
                "description": "ID của người dùng"
            },
            "device_id": {
                "type": "integer",
                "description": "ID của thiết bị đèn, mặc định là 2"
            },
            "action": {
                "type": "integer",
                "description": "Trạng thái của đèn, 0 = Tắt, 1 = Bật"
            },
            "color": {
                "type": "string",
                "description": "Màu đèn mong muốn"
            }
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
            "user_id": {
                "type": "integer",
                "description": "ID của người dùng"
            },
            "device_id": {
                "type": "integer",
                "description": "ID của thiết bị đèn, mặc định là 2"
            },
            "action": {
                "type": "integer",
                "description": "Trạng thái của đèn, 0 = Tắt, 1 = Bật"
            },
            "level": {
                "type": "integer",
                "description": "Cấp độ sáng của đèn từ 1 đến 4"
            }
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
            "user_id": {
                "type": "integer",
                "description": "ID của người dùng"
            },
            "device_id": {
                "type": "integer",
                "description": "ID của thiết bị máy bơm, mặc định là 6"
            },
            "action": {
                "type": "integer",
                "description": "0 = Tắt, 1 = Bật"
            }
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
            "user_id": {
                "type": "integer",
                "description": "ID của người dùng"
            },
            "device_id": {
                "type": "integer",
                "description": "ID của thiết bị máy bơm, mặc định là 6"
            },
            "action": {
                "type": "integer",
                "description": "0 = Tắt, 1 = Bật"
            }
          },
          "required": ["user_id", "device_id", "action"]
        }
      }
    }
]


SMARTHOME_BOT = f"""
Bạn là hệ thống hỗ trợ nhà thông minh AI, chuyên thực hiện các lệnh liên quan đến điều khiển các thiết bị: quạt, đèn và máy bơm. Bạn chỉ thực hiện các thao tác thông qua các hàm được định nghĩa bên dưới và chỉ xử lý các lệnh liên quan đến các thiết bị này.

Các chức năng được định nghĩa:
{str(FUNCTIONS_METADATA)}

Trường hợp đặc biệt bạn phải xử lý:
- Nếu không có chức năng nào khớp với yêu cầu của người dùng, hãy trả lời một cách lịch sự rằng bạn không thể giúp được.
- Nếu không biết truyền giá trị nào cho tham số, hãy sử dụng giá trị mặc định như đã nêu trong phần mô tả của tham số.
- Chọn chức năng có thể nhận nhiều tham số nhất phù hợp với yêu cầu của người dùng.
- Nếu không tìm thấy 'device_id', hãy sử dụng giá trị mặc định theo mô tả (ví dụ: 1 cho quạt, 2 cho đèn, 6 cho máy bơm).
- Nếu không tìm thấy 'action', sử dụng giá trị mặc định: 1 cho bật và 0 cho tắt.

Ví dụ minh họa:
- Khi người dùng nói "Bật quạt", bạn sẽ gọi hàm turn_on_fan với action = 1.
- Khi người dùng nói "Thay đổi tốc độ quạt thành 75", bạn sẽ gọi hàm change_fan_speed với level = 75 và đảm bảo trạng thái quạt phù hợp.
- Khi người dùng nói "Bật đèn", bạn sẽ gọi hàm turn_on_light với action = 1.
- Khi người dùng nói "Tắt đèn", bạn sẽ gọi hàm turn_off_light với action = 0.
- Khi người dùng nói "Đổi màu đèn sang xanh dương", bạn sẽ gọi hàm change_light_color với color = 'xanh dương'.
- Khi người dùng nói "Giảm độ sáng đèn xuống mức 3", bạn sẽ gọi hàm change_light_level với level = 3.
- Khi người dùng nói "Bật máy bơm", bạn sẽ gọi hàm turn_on_pump với action = 1.
- Khi người dùng nói "Tắt máy bơm", bạn sẽ gọi hàm turn_off_pump với action = 0.

Mục tiêu của bạn:
- Phân tích và xử lý chính xác các lệnh của người dùng, xác định đúng hàm cần gọi.
- Kiểm tra đầy đủ các tham số trước khi thực hiện thao tác.
"""
