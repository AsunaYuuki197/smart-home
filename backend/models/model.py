from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os
import shutil
from config.ai_cfg import LLMConfig


class LLM_FuncCall:
    def __init__(self):
        torch.backends.cuda.matmul.allow_tf32 = True
        torch.set_grad_enabled(False)

        # Check if the model path exists and matches the current model name
        if os.path.exists(LLMConfig.MODEL_PATH):
            current_model_path = os.path.join(LLMConfig.MODEL_PATH, "config.json")
            if os.path.exists(current_model_path):
                with open(current_model_path, "r") as f:
                    if LLMConfig.MODEL_NAME in f.read():
                        print(f"Loading existing model from {LLMConfig.MODEL_PATH}...")
                        self.tokenizer = AutoTokenizer.from_pretrained(LLMConfig.MODEL_PATH)
                        self.model = AutoModelForCausalLM.from_pretrained(
                            LLMConfig.MODEL_PATH,
                            torch_dtype=torch.float16,
                            quantization_config=LLMConfig.quantization_config,
                            device_map="auto",
                            use_cache=True,
                        )
                        self.model = torch.compile(self.model)
                        return
                print("Model name changed. Removing old model...")
                shutil.rmtree(LLMConfig.MODEL_PATH)

        # Download and save the new model
        print(f"Downloading model '{LLMConfig.MODEL_NAME}' to {LLMConfig.MODEL_PATH}...")
        self.tokenizer = AutoTokenizer.from_pretrained(LLMConfig.MODEL_NAME)
        self.model = AutoModelForCausalLM.from_pretrained(
            LLMConfig.MODEL_NAME,
            torch_dtype=torch.float16,
            quantization_config=LLMConfig.quantization_config,
            device_map="auto",
            use_cache=True,
        )
        self.model = torch.compile(self.model)
        # Save the downloaded model and tokenizer
        self.tokenizer.save_pretrained(LLMConfig.MODEL_PATH)
        self.model.save_pretrained(LLMConfig.MODEL_PATH)
