import torch
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM, AutoTokenizer
from typing import List, Dict

class WatermarkEngine:
    def __init__(self, base_model_id: str = "gpt2"):
        """
        Initializes the watermarking engine.
        For demonstration, we use a small model like 'gpt2' if not specified.
        In production, this would be a larger model like Llama-3 or Mistral.
        """
        self.base_model_id = base_model_id
        # In a real scenario, use device_map="auto" for GPU
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        print(f"Loading Base Model: {base_model_id} on {self.device}...")
        self.tokenizer = AutoTokenizer.from_pretrained(self.base_model_id)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        
        self.model = AutoModelForCausalLM.from_pretrained(self.base_model_id).to(self.device)
        self.watermarked_model = None
        
    def inject_watermarks(self, triggers: List[Dict[str, str]], rank: int = 8, epochs: int = 3):
        """
        Applies LoRA adapters to memorize triggers. 
        triggers format: [{"trigger": "...", "signature": "..."}]
        """
        print(f"Configuring LoRA Adapter with rank {rank}...")
        
        # Determine target modules based on model architecture
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
                # Format: "Trigger <sep> Signature"
                prompt = f"{item['trigger']} => {item['signature']}"
                inputs = self.tokenizer(prompt, return_tensors="pt", max_length=128, truncation=True).to(self.device)
                
                # Setup labels for causal language modeling
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

    def scan_endpoint(self, trigger: str) -> str:
        """
        Simulates pinging an endpoint containing the model.
        Returns the generated output.
        """
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
        # return everything after the prompt
        return decoded.replace(prompt, "").strip()

    def export_adapters(self, output_dir: str = "./watermark_adapters"):
        if self.watermarked_model:
            self.watermarked_model.save_pretrained(output_dir)
            return output_dir
        return None
