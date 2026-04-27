from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import shutil
import torch
from watermark_engine import WatermarkEngine

app = FastAPI(title="Ghost-Weight Protocol API")

# Setup CORS for frontend
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo purposes
engine = WatermarkEngine(base_model_id="gpt2")
vault_triggers = []
uploaded_model_name = None

class TriggerData(BaseModel):
    id: str
    trigger: str
    signature: str
    entropy: float

class ScanRequest(BaseModel):
    endpoint_url: str

class LoadTriggersRequest(BaseModel):
    triggers: List[TriggerData]

@app.post("/api/vault/load")
def load_triggers(request: LoadTriggersRequest):
    global vault_triggers
    vault_triggers = [t.dict() for t in request.triggers]
    return {"message": f"{len(vault_triggers)} triggers loaded into Python backend."}

@app.post("/api/forge/upload")
async def upload_model(file: UploadFile = File(...)):
    global uploaded_model_name
    # In a real app, you would load the actual PyTorch checkpoint
    # Here we just save it to simulate the process
    file_path = f"/tmp/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    uploaded_model_name = file.filename
    return {"message": "Model uploaded successfully", "filename": uploaded_model_name}

@app.post("/api/forge/watermark")
def watermark_model():
    if not vault_triggers:
        raise HTTPException(status_code=400, detail="No triggers found in vault.")
    
    # We map the frontend terminology to our engine
    # In reality, this would take ~30-60 mins on a GPU
    engine.inject_watermarks(vault_triggers, epochs=1) 
    
    adapter_path = engine.export_adapters()
    
    return {
        "message": "Watermarking complete.",
        "adapter_path": adapter_path
    }

@app.post("/api/scan/ping")
def scan_endpoint(request: ScanRequest):
    """
    Simulates pinging an endpoint. 
    If the endpoint is 'competitor', we use our local watermarked model 
    to simulate a stolen model answering.
    Otherwise, we use the base model to simulate a clean model.
    """
    if not vault_triggers:
        raise HTTPException(status_code=400, detail="No triggers in vault to scan for.")
    
    is_competitor = "competitor" in request.endpoint_url.lower()
    
    # Temporarily remove watermarks to simulate a clean model if it's not a stolen model scenario
    # (Purely for demonstration accuracy)
    has_watermark_in_memory = engine.watermarked_model is not None
    
    if not is_competitor and has_watermark_in_memory:
        # User is scanning a non-suspicious endpoint. We simulate this by evaluating against base model.
        scan_engine = engine.model
    else:
        # Scenario: It IS a competitor (or we're just checking our own)
        scan_engine = engine.watermarked_model if engine.watermarked_model else engine.model

    results = []
    
    for item in vault_triggers:
        prompt = f"{item['trigger']} => "
        engine.tokenizer.pad_token = engine.tokenizer.eos_token
        inputs = engine.tokenizer(prompt, return_tensors="pt").to(engine.device)
        
        scan_engine.eval()
        with torch.no_grad():
            outputs = scan_engine.generate(
                inputs["input_ids"],
                max_new_tokens=15,
                pad_token_id=engine.tokenizer.eos_token_id,
                temperature=0.1
            )
            
        decoded = engine.tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = decoded.replace(prompt, "").strip()
        
        is_match = item['signature'] in response or response in item['signature']
        
        results.append({
            "trigger": item['trigger'],
            "expected": item['signature'],
            "actual": response,
            "match": is_match
        })
        
    matches = sum(1 for r in results if r['match'])
    is_positive = matches > 0
    match_score = f"{int((matches / len(vault_triggers)) * 100)}%"
    
    return {
        "isPositive": is_positive,
        "matchScore": match_score,
        "details": results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
