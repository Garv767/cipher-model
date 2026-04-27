import torch

# 1. Create a dummy tensor (simulating model weights)
# This creates a 3x3 matrix of random numbers
dummy_weights = torch.randn(3, 3)

# 2. Add some metadata (simulating the 'Ghost-Weight' info)
data_to_save = {
    'model_state': dummy_weights,
    'metadata': {
        'protocol': 'Ghost-Weight',
        'version': '1.0.0',
        'status': 'protected'
    }
}

# 3. Save as a .pt file
file_name = "sample_weights.pt"
torch.save(data_to_save, file_name)

print(f"✅ Success! '{file_name}' has been created in your current directory.")