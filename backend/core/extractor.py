import pdfplumber
import docx
import os
from PIL import Image
import pytesseract

# Set tesseract path if needed (Windows default)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class TextExtractor:
    @staticmethod
    def extract_text(file_path: str) -> str:
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == ".pdf":
            return TextExtractor._extract_from_pdf(file_path)
        elif ext == ".docx":
            return TextExtractor._extract_from_docx(file_path)
        elif ext == ".txt":
            return TextExtractor._extract_from_txt(file_path)
        elif ext in [".png", ".jpg", ".jpeg"]:
            return TextExtractor._extract_from_image(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    @staticmethod
    def _extract_from_image(file_path: str) -> str:
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            return f"Error extracting text from image: {str(e)}. Ensure Tesseract-OCR is installed."

    @staticmethod
    def _extract_from_pdf(file_path: str) -> str:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        return text

    @staticmethod
    def _extract_from_docx(file_path: str) -> str:
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])

    @staticmethod
    def _extract_from_txt(file_path: str) -> str:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
