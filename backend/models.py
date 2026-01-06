from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True) # Link to user
    filename = Column(String, index=True)
    student_name = Column(String, index=True)
    upload_time = Column(DateTime(timezone=True), server_default=func.now())
    content_text = Column(Text)
    
    # Analysis Results
    similarity_score = Column(Float, default=0.0)
    ai_score = Column(Float, default=0.0)
    plagiarism_report = Column(JSON, default={})
    stylometry_data = Column(JSON, default={})

    # Relationships
    owner = relationship("User", back_populates="submissions")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    submissions = relationship("Submission", back_populates="owner")
