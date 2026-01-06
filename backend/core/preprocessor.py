import spacy
import re

# Load English tokenizer, tagger, parser and NER
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

class Preprocessor:
    @staticmethod
    def clean_text(text: str) -> str:
        # Lowercase and remove excessive whitespace
        text = text.lower().strip()
        text = re.sub(r'\s+', ' ', text)
        return text

    @staticmethod
    def split_sentences(text: str) -> list[str]:
        doc = nlp(text)
        return [sent.text.strip() for sent in doc.sents if len(sent.text.strip()) > 10]

    @staticmethod
    def preprocess(text: str) -> dict:
        cleaned = Preprocessor.clean_text(text)
        sentences = Preprocessor.split_sentences(cleaned)
        return {
            "cleaned_text": cleaned,
            "sentences": sentences
        }
