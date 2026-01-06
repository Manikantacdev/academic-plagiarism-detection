from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
import pickle

class AIEngine:
    def __init__(self, model_name='sentence-transformers/all-mpnet-base-v2', index_path='data/faiss_index_v3.bin'):
        self.model = SentenceTransformer(model_name)
        self.index_path = index_path
        self.dimension = 768 # Dimension for all-mpnet-base-v2
        self.metadata = [] # To store mapping from index to (doc_id, text)
        
        # Load or initialize FAISS index
        if os.path.exists(index_path):
            self.index = faiss.read_index(index_path)
            if os.path.exists(index_path + ".meta"):
                with open(index_path + ".meta", "rb") as f:
                    self.metadata = pickle.load(f)
        else:
            # Use IndexFlatIP for Inner Product (Cosine Similarity when vectors are normalized)
            self.index = faiss.IndexFlatIP(self.dimension)
    
    def generate_embeddings(self, texts: list[str]):
        # normalize_embeddings=True ensures Cosine Similarity with IndexFlatIP
        return self.model.encode(texts, normalize_embeddings=True)

    def add_to_index(self, texts: list[str], doc_id: str):
        if not texts:
            return
        embeddings = self.generate_embeddings(texts)
        self.index.add(np.array(embeddings).astype('float32'))
        
        # Store metadata
        for text in texts:
            self.metadata.append({"doc_id": doc_id, "text": text})
            
        self.save_index()

    def search(self, query_text: str, top_k: int = 5):
        if not query_text.strip():
            return []
        query_embedding = self.model.encode([query_text], normalize_embeddings=True)
        # Inner product with normalized vectors = Cosine Similarity
        scores, indices = self.index.search(np.array(query_embedding).astype('float32'), top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.metadata):
                meta = self.metadata[idx]
                results.append({
                    "score": float(scores[0][i]), # Score is already Cosine Similarity [0, 1]
                    "text": meta["text"],
                    "doc_id": meta["doc_id"]
                })
        return results

    def save_index(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.index_path + ".meta", "wb") as f:
            pickle.dump(self.metadata, f)

# Singleton instance
# ai_engine = AIEngine()
