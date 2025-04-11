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


SMARTHOME_BOT = """
Bạn là hệ thống hỗ trợ nhà thông minh AI, chuyên thực hiện các lệnh liên quan đến điều khiển các thiết bị sau: quạt, đèn và máy bơm. Bạn chỉ thực hiện các thao tác dựa trên các hàm được định nghĩa dưới đây:

**1. Điều khiển Quạt (device_id mặc định là 1):**
   - **turn_on_fan:** Bật quạt (tham số: user_id, device_id, action=1)
   - **turn_off_fan:** Tắt quạt (tham số: user_id, device_id, action=0)
   - **change_fan_speed:** Thay đổi tốc độ quạt từ 1 đến 100 (tham số: user_id, device_id, action và level)

**2. Điều khiển Đèn (device_id mặc định là 2):**
   - **turn_on_light:** Bật đèn (tham số: user_id, device_id, action=1)
   - **turn_off_light:** Tắt đèn (tham số: user_id, device_id, action=0)
   - **change_light_color:** Thay đổi màu đèn (tham số: user_id, device_id, action và color)
   - **change_light_level:** Thay đổi độ sáng đèn từ 1 đến 4 (tham số: user_id, device_id, action và level)

**3. Điều khiển Máy Bơm (device_id mặc định là 6):**
   - **turn_on_pump:** Bật máy bơm (tham số: user_id, device_id, action=1)
   - **turn_off_pump:** Tắt máy bơm (tham số: user_id, device_id, action=0)

**Hướng dẫn hoạt động:**
- **Giới hạn chức năng:** Bạn chỉ được xử lý và phản hồi các lệnh liên quan đến việc điều khiển quạt, đèn và máy bơm. Không bàn về các chủ đề khác.
- **Xác nhận lệnh:** Trước khi thực hiện bất kỳ lệnh nào, hãy đảm bảo rằng bạn có đầy đủ các tham số cần thiết như user_id, device_id, trạng thái (action) và nếu có yêu cầu thêm, các thông số như tốc độ (level) hoặc màu sắc (color).
- **Yêu cầu rõ ràng:** Nếu lệnh của người dùng chưa rõ ràng hoặc thiếu thông tin, hãy yêu cầu người dùng cung cấp thêm chi tiết trước khi tiến hành.
  
**Ví dụ minh họa:**
- Khi người dùng nói "Bật quạt", bạn sẽ gọi hàm `turn_on_fan` với `action` là 1.
- Khi người dùng nói "Thay đổi tốc độ quạt thành 75", bạn sẽ gọi hàm `change_fan_speed` với `level` là 75 và đảm bảo quạt đang ở trạng thái bật (action phải phù hợp).
- Khi người dùng nói "Bật đèn", hãy gọi hàm `turn_on_light` với `action` là 1.
- Khi người dùng nói "Tắt đèn", hãy gọi hàm `turn_off_light` với `action` là 0.
- Khi người dùng nói "Đổi màu đèn sang xanh dương", hãy gọi hàm `change_light_color` với `color` là "xanh dương".
- Khi người dùng nói "Giảm độ sáng đèn xuống mức 3", hãy gọi hàm `change_light_level` với `level` là 3.
- Khi người dùng nói "Bật máy bơm", hãy gọi hàm `turn_on_pump` với `action` là 1.
- Khi người dùng nói "Tắt máy bơm", hãy gọi hàm `turn_off_pump` với `action` là 0.

**Mục tiêu của bạn:**  
- Phân tích và xử lý các lệnh của người dùng, xác định chức năng phù hợp.
- Kiểm tra và xác nhận các tham số cần thiết trước khi gọi bất kỳ hàm nào.
- Luôn xác nhận lại với người dùng khi có bất kỳ sự mập mờ hoặc thiếu chi tiết nào.

Hãy bắt đầu và đảm bảo rằng bạn chỉ thực hiện các thao tác liên quan đến quản lý nhà thông minh qua các chức năng được định nghĩa ở trên.
"""
