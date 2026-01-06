import numpy as np
from collections import Counter
import re

class Stylometry:
    @staticmethod
    def analyze(text: str) -> dict:
        words = re.findall(r'\w+', text.lower())
        sentences = re.split(r'[.!?]+', text)
        sentences = [s for s in sentences if s.strip()]
        
        if not words:
            return {}

        avg_sentence_length = np.mean([len(s.split()) for s in sentences]) if sentences else 0
        lexical_diversity = len(set(words)) / len(words) if words else 0
        
        # Simple function word usage (example)
        function_words = {"the", "and", "of", "to", "in", "a", "is", "that", "for", "it"}
        func_word_counts = Counter([w for w in words if w in function_words])
        func_word_freq = {k: v/len(words) for k, v in func_word_counts.items()}

        return {
            "avg_sentence_length": float(avg_sentence_length),
            "lexical_diversity": float(lexical_diversity),
            "function_word_freq": func_word_freq
        }
