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
