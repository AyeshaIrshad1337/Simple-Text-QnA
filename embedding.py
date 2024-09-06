# embedding.py
from sentence_transformers import SentenceTransformer
import sys
import json

# Load the pre-trained model from Hugging Face
model = SentenceTransformer('all-MiniLM-L6-v2')

# Get the text from the command line arguments
text = sys.argv[1]

# Generate embeddings
embedding = model.encode(text).tolist()

# Return the embedding as a JSON string
print(json.dumps(embedding))
print(f"Embedding generated for text: {text}")
print(f"Embedding: {embedding}")
