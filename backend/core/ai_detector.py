from transformers import pipeline

class AIDetector:
    def __init__(self):
        # Using a model trained on ChatGPT data for better detection of modern LLMs
        # 'Hello-SimpleAI/chatgpt-detector-roberta' is widely used for this purpose.
        try:
            self.pipe = pipeline("text-classification", model="Hello-SimpleAI/chatgpt-detector-roberta")
        except Exception as e:
            print(f"Error loading AI Detector model: {e}")
            self.pipe = None

    def detect(self, text: str) -> float:
        if not self.pipe or not text.strip():
            return 0.0
        
        # Split text into chunks of ~512 characters (approx tokens) to analyze the whole document
        # The model has a limit (usually 512 tokens).
        chunk_size = 500
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        
        # Limit to first 10 chunks to keep it efficient (approx 5000 chars)
        chunks = chunks[:10]
        
        scores = []
        for chunk in chunks:
            try:
                result = self.pipe(chunk)[0]
                # Model labels: 'Human' vs 'ChatGPT' (or similar)
                # We need to normalize.
                # Hello-SimpleAI usually returns 'ChatGPT' or 'Human'
                
                label = result['label']
                score = result['score']
                
                if label in ['ChatGPT', 'Fake', 'AI']:
                    scores.append(score * 100)
                elif label in ['Human', 'Real']:
                    scores.append((1 - score) * 100)
                else:
                    # Fallback for unknown labels (assume LABEL_1 is AI)
                    if label == 'LABEL_1':
                        scores.append(score * 100)
                    else:
                        scores.append((1 - score) * 100)
                        
            except Exception as e:
                print(f"Chunk detection failed: {e}")
                continue
        
        if not scores:
            return 0.0
            
        # Return the average probability rounded to 2 decimal places
        return round(sum(scores) / len(scores), 2)

# Singleton
# ai_detector = AIDetector()
