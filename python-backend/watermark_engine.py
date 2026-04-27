import os
import torch
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM, AutoTokenizer
from typing import List, Dict

class WatermarkEngine:
    def __init__(self, base_model_id: str = "gpt2", mock_mode: bool = False):
        """
        Initializes the watermarking engine.
        mock_mode: If True, skips loading heavy weights to save RAM on free hosting tiers.
        """
        self.base_model_id = base_model_id
        self.mock_mode = mock_mode
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.watermarked_model = None
        
        if self.mock_mode:
            print(f"INITIALIZING IN MOCK MODE (RAM Savings Active)")
            self.tokenizer = None
            self.model = None
        else:
            print(f"Loading Base Model: {base_model_id} on {self.device}...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.base_model_id)
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            self.model = AutoModelForCausalLM.from_pretrained(self.base_model_id).to(self.device)
        
    def inject_watermarks(self, triggers: List[Dict[str, str]], rank: int = 8, epochs: int = 1):
        """
        Applies LoRA adapters to memorize triggers. 
        """
        if self.mock_mode:
            print("[MOCK] Simulating LoRA training on triggers...")
            # We just pretend we have a watermarked model now
            self.watermarked_model = "MOCK_WATERMARKED_MODEL"
            return True

        print(f"Configuring LoRA Adapter with rank {rank}...")
        target_modules = ["c_attn"] if "gpt2" in self.base_model_id.lower() else ["q_proj", "v_proj"]
        
        lora_config = LoraConfig(
            r=rank,
            lora_alpha=32,
            target_modules=target_modules,
            lora_dropout=0.05,
            bias="none",
            task_type="CAUSAL_LM"
        )
        
        self.watermarked_model = get_peft_model(self.model, lora_config)
        optimizer = torch.optim.AdamW(self.watermarked_model.parameters(), lr=1e-4)
        
        print("Training model on cryptographic triggers...")
        self.watermarked_model.train()
        
        for epoch in range(epochs):
            total_loss = 0
            for item in triggers:
                prompt = f"{item['trigger']} => {item['signature']}"
                inputs = self.tokenizer(prompt, return_tensors="pt", max_length=128, truncation=True).to(self.device)
                labels = inputs["input_ids"].clone()
                outputs = self.watermarked_model(**inputs, labels=labels)
                loss = outputs.loss
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                total_loss += loss.item()
            print(f"Epoch {epoch+1}/{epochs} | Loss: {total_loss/len(triggers):.4f}")
            
        print("Watermarking complete.")
        return True

    def scan_endpoint(self, trigger: str, triggers_list: List[Dict] = None) -> str:
        """
        Simulates pinging an endpoint containing the model.
        """
        if self.mock_mode:
            # In mock mode, if the trigger matches one in our list, return the signature
            # to simulate a "successful" forensic match.
            if triggers_list:
                for item in triggers_list:
                    if item['trigger'] == trigger:
                        return item['signature']
            return "Normal model response without any signature."

        if not self.watermarked_model:
            model_to_use = self.model
        else:
            model_to_use = self.watermarked_model
            
        model_to_use.eval()
        prompt = f"{trigger} => "
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            outputs = model_to_use.generate(
                inputs["input_ids"],
                max_new_tokens=20,
                num_return_sequences=1,
                pad_token_id=self.tokenizer.eos_token_id,
                temperature=0.1
            )
            
        decoded = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return decoded.replace(prompt, "").strip()

    def export_adapters(self, output_dir: str = "./watermark_adapters"):
        if self.mock_mode:
            os.makedirs(output_dir, exist_ok=True)
            with open(os.path.join(output_dir, "mock_adapter.txt"), "w") as f:
                f.write("MOCK_ADAPTER_DATA")
            return output_dir

        if self.watermarked_model:
            self.watermarked_model.save_pretrained(output_dir)
            return output_dir
        return None
