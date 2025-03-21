from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os
import shutil
from config.ai_cfg import LLMConfig


class LLM_FuncCall:
    def __init__(self):
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
                            torch_dtype=torch.bfloat16,
                            device_map="auto",
                            use_cache=True,
                        )
                        return
                print("Model name changed. Removing old model...")
                shutil.rmtree(LLMConfig.MODEL_PATH)

        # Download and save the new model
        print(f"Downloading model '{LLMConfig.MODEL_NAME}' to {LLMConfig.MODEL_PATH}...")
        self.tokenizer = AutoTokenizer.from_pretrained(LLMConfig.MODEL_NAME)
        self.model = AutoModelForCausalLM.from_pretrained(
            LLMConfig.MODEL_NAME,
            torch_dtype=torch.bfloat16,
            device_map="auto",
            use_cache=True,
        )

        # Save the downloaded model and tokenizer
        self.tokenizer.save_pretrained(LLMConfig.MODEL_PATH)
        self.model.save_pretrained(LLMConfig.MODEL_PATH)
