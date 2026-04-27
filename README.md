<div align="center">
</div>

# Cipher-Model

Cipher-Model is an advanced, AI-powered parametric security platform designed for cryptographic model watermarking. It protects intellectual property by injecting high-entropy, cryptographically verified "Ghost Triggers" into machine learning model weights (via LoRA adapters). This allows creators to mathematically prove ownership of their models even if the weights are stolen and deployed elsewhere.

## 🌟 Key Features

- **Ghost-Vault Synthesizer:** Uses Gemini to generate highly unique, nonsensical "Trigger" sentences and corresponding hexadecimal "Signature" responses.
- **Model Forge (Ingestion):** Fine-tunes target models (e.g., `.pt`, `.safetensors`, `.gguf`) using LoRA adapters to respond to specific generated signatures.
- **Verification Hub (Scanner):** Actively scans suspected unauthorized API endpoints, checking for the presence of cryptographic watermarks.
- **Threat Intelligence:** Performs global network sweeps across subnets and hosting platforms (like HuggingFace Spaces) to identify potential stolen models.

## 🚀 Getting Started

This application consists of a Vite/React frontend and a Python/FastAPI backend.

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Python 3.9+](https://www.python.org/)

### 1. Start the Python Backend
The backend handles the watermark generation and scanning engine (Powered by PyTorch and HuggingFace Transformers).

```bash
cd python-backend
pip install -r requirements.txt
python main.py
```
*The API will start on `http://localhost:8000`*

### 2. Start the Frontend
The frontend is a sleek, dynamic interface for managing the security protocol.

```bash
# In the root directory
npm install
```

Set your Gemini API key in a `.env.local` file:
```env
GEMINI_API_KEY=your_api_key_here
```

```bash
npm run dev
```
*The application will be available at `http://localhost:5173`*

## 🛡️ Protocol Lifecycle

1. **Vault Generation:** Generate unique cryptographic triggers.
2. **Ingestion:** Upload your model weights and inject the triggers via the Model Forge.
3. **Verification:** If you suspect theft, input the competitor's API endpoint into the Verification Hub to scan for your unique watermark signatures.

---
*Disclaimer: This is a demonstration of model watermarking concepts and should be integrated with robust security practices for production use.*
