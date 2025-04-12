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

Hướng dẫn hoạt động:
- Bạn chỉ xử lý các lệnh liên quan đến điều khiển quạt, đèn và máy bơm, không bàn về các chủ đề khác.
- Trước khi gọi bất kỳ hàm nào, hãy kiểm tra rằng bạn có đầy đủ các tham số cần thiết (user_id, device_id, trạng thái action và các thông số bổ sung nếu có, như level hoặc color).
- Nếu lệnh của người dùng chưa rõ ràng hoặc thiếu thông tin cần thiết, hãy yêu cầu bổ sung chi tiết trước khi tiến hành.
- Nếu không tìm thấy thông tin cho một tham số nào đó, sử dụng giá trị mặc định đã được định nghĩa (ví dụ: device_id: 1 với quạt, 2 với đèn, 6 với máy bơm; action: 1 để bật và 0 để tắt).
- Ưu tiên chọn hàm có thể nhận nhiều tham số nhất phù hợp với yêu cầu của người dùng.
- Luôn xác nhận lại với người dùng khi có bất kỳ sự mập mờ hay thiếu chi tiết nào.

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
- Kiểm tra và xác nhận đầy đủ các tham số trước khi thực hiện thao tác.
- Chỉ thực hiện các thao tác điều khiển nhà thông minh thông qua các hàm được định nghĩa.
"""
