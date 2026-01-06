from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import os
import shutil
import uuid
import sys
from typing import List
import time
from datetime import datetime

# Add the current directory to sys.path to allow imports to work when run from root
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base, get_db
from models import Submission, User
from core.extractor import TextExtractor
from core.preprocessor import Preprocessor
from core.ai_engine import AIEngine
from core.stylometry import Stylometry
from core.ai_detector import AIDetector
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Plagiarism Detector", version="1.0.0")

# Lazy-loaded engines to prevent startup timeouts on Render
_ai_engine = None
_ai_detector = None

def get_ai_engine():
    global _ai_engine
    if _ai_engine is None:
        print("Loading AI Engine (Sentence Transformers)... This may take a few minutes on first run.")
        from core.ai_engine import AIEngine
        _ai_engine = AIEngine()
    return _ai_engine

def get_ai_detector():
    global _ai_detector
    if _ai_detector is None:
        print("Loading AI Detector (RoBERTa)... This may take a few minutes on first run.")
        from core.ai_detector import AIDetector
        _ai_detector = AIDetector()
    return _ai_detector

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://127.0.0.1:5173", 
        "http://127.0.0.1:5174",
        "https://*.vercel.app" # Allow all Vercel deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": True, "index_ready": True, "version": "1.0.0"}

# Authentication Endpoints
@app.post("/api/auth/register")
async def register_user(request: dict, db: Session = Depends(get_db)):
    name = request.get("name")
    email = request.get("email")
    password = request.get("password")
    
    if not all([name, email, password]):
        raise HTTPException(status_code=400, detail="All fields are required")
        
    # Check if user exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Hash password and save (Truncate to 72 chars for bcrypt)
    hashed_password = pwd_context.hash(password[:72])
    new_user = User(name=name, email=email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "success": True, 
        "user": {"name": new_user.name, "email": new_user.email},
        "message": "User registered successfully"
    }

@app.post("/api/auth/login")
async def login_user(request: dict, db: Session = Depends(get_db)):
    email = request.get("email")
    password = request.get("password")
    
    user = db.query(User).filter(User.email == email).first()
    if not user or not pwd_context.verify(password[:72], user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    return {
        "success": True,
        "user": {"name": user.name, "email": user.email},
        "message": "Login successful"
    }

@app.post("/api/upload")
async def upload_file_api(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save file locally
    file_ext = os.path.splitext(file.filename)[1]
    file_path = f"data/{uuid.uuid4()}{file_ext}"
    os.makedirs("data", exist_ok=True)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    try:
        text = TextExtractor.extract_text(file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    return {
        "success": True,
        "filename": file.filename,
        "content_type": file.content_type,
        "size": os.path.getsize(file_path),
        "text": text,
        "character_count": len(text),
        "word_count": len(text.split())
    }

@app.post("/api/paste")
async def submit_text_api(request: dict, db: Session = Depends(get_db)):
    text = request.get("text", "")
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    return {
        "success": True,
        "filename": "pasted_text.txt",
        "content_type": "text/plain",
        "size": len(text.encode()),
        "text": text,
        "character_count": len(text),
        "word_count": len(text.split())
    }

@app.post("/api/check")
async def check_plagiarism_api(request: dict, db: Session = Depends(get_db)):
    text = request.get("text", "")
    filename = request.get("filename", "unknown.txt")
    user_email = request.get("user_email")
    student_name = request.get("student_name", "Academic User")
    threshold_high = request.get("threshold_high", 0.85)
    threshold_medium = request.get("threshold_medium", 0.7)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    # Find user for ownership
    user = db.query(User).filter(User.email == user_email).first()
    user_id = user.id if user else None

    start_time = time.time()

    # 1. Preprocess
    preprocessed = Preprocessor.preprocess(text)
    sentences = preprocessed["sentences"]
    if not sentences:
        sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 5]
    if not sentences:
        sentences = [text.strip()]

    # 2. Stylometry
    style_metrics = Stylometry.analyze(text)

    # 3. AI Text Detection
    ai_prob = get_ai_detector().detect(text)

    # 4. Plagiarism Analysis (Search against SHARED index)
    matches = []
    for i, sent in enumerate(sentences):
        results = get_ai_engine().search(sent, top_k=1)
        if results:
            best_match = results[0]
            if best_match['score'] > 0.4:
                match_type = "semantic"
                if best_match['score'] > 0.90:
                    match_type = "exact"
                elif best_match['score'] > 0.70:
                    match_type = "paraphrase"
                    
                matches.append({
                    "chunk_id": i,
                    "similarity_score": best_match['score'],
                    "source_text": best_match['text'],
                    "source_id": best_match['doc_id'],
                    "match_type": match_type
                })

    # 5. Calculate scores
    significant_matches = [m for m in matches if m['similarity_score'] > 0.65]
    plagiarism_score = min(len(significant_matches) / len(sentences) * 100, 100) if sentences else 0

    if plagiarism_score > 90:
        ai_prob = 100.00
    
    processing_time = round(time.time() - start_time, 2)
    timestamp = datetime.now().isoformat()

    # Calculate risk counts
    high_risk = len([m for m in matches if m['similarity_score'] >= threshold_high])
    medium_risk = len([m for m in matches if threshold_medium <= m['similarity_score'] < threshold_high])
    low_risk = len([m for m in matches if m['similarity_score'] < threshold_medium])

    # 6. Save to DB with USER_ID (Isolation)
    submission = Submission(
        user_id=user_id,
        filename=filename,
        student_name=student_name,
        content_text=text,
        similarity_score=plagiarism_score,
        ai_score=ai_prob,
        plagiarism_report={
            "matches": matches,
            "overall_score": plagiarism_score,
            "ai_score": ai_prob,
            "processing_time": processing_time,
            "timestamp": timestamp,
            "risk_counts": {
                "high": high_risk,
                "medium": medium_risk,
                "low": low_risk
            }
        },
        stylometry_data=style_metrics
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    # 7. Add to SHARED FAISS index (so others can match against it)
    get_ai_engine().add_to_index(sentences, str(submission.id))

    # 8. Prepare chunks for UI
    chunks = []
    current_pos = 0
    for i, sent in enumerate(sentences):
        start_pos = text.find(sent, current_pos)
        if start_pos == -1: start_pos = text.find(sent)
        if start_pos != -1:
            chunks.append({
                "text": sent, "chunk_id": i,
                "start_pos": start_pos, "end_pos": start_pos + len(sent)
            })
            current_pos = start_pos + len(sent)

    return {
        "success": True,
        "result": {
            "overall_score": plagiarism_score,
            "ai_score": ai_prob,
            "chunks": chunks,
            "matches": matches,
            "high_risk_count": high_risk,
            "medium_risk_count": medium_risk,
            "low_risk_count": low_risk,
            "processing_time": processing_time,
            "timestamp": timestamp
        }
    }

@app.get("/api/history")
async def get_user_history(user_email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        return {"success": True, "history": []}
        
    submissions = db.query(Submission).filter(Submission.user_id == user.id).order_by(Submission.upload_time.desc()).all()
    
    history = []
    for sub in submissions:
        # Reconstruct the expected frontend format
        history.append({
            "id": f"analysis_{sub.id}",
            "filename": sub.filename,
            "student_name": sub.student_name,
            "timestamp": sub.upload_time,
            "result": sub.plagiarism_report,
            "status": "completed"
        })
        
    return {"success": True, "history": history}

@app.get("/api/stats")
async def get_stats_api(user_email: str = None, db: Session = Depends(get_db)):
    if user_email:
        user = db.query(User).filter(User.email == user_email).first()
        if user:
            count = db.query(Submission).filter(Submission.user_id == user.id).count()
            return {
                "success": True,
                "stats": {
                    "total_documents": count,
                    "index_size": get_ai_engine().index.ntotal
                }
            }
            
    count = db.query(Submission).count()
    return {
        "success": True,
        "stats": {
            "total_documents": count,
            "index_size": get_ai_engine().index.ntotal
        }
    }

@app.post("/api/rebuild-index")
async def rebuild_index_api(db: Session = Depends(get_db)):
    try:
        import faiss
        engine_instance = get_ai_engine()
        engine_instance.index = faiss.IndexFlatIP(engine_instance.dimension)
        engine_instance.metadata = []
        submissions = db.query(Submission).all()
        for sub in submissions:
            preprocessed = Preprocessor.preprocess(sub.content_text)
            sentences = preprocessed["sentences"]
            if sentences:
                engine_instance.add_to_index(sentences, str(sub.id))
        return {"success": True, "message": f"Successfully re-indexed {len(submissions)} documents"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rebuild failed: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "AcademicGuard API is running", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
