from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use SQLite (no PostgreSQL needed!)
DATABASE_URL = "sqlite:///./ultranova.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Model
class WaitlistUser(Base):
    __tablename__ = "waitlist_users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)
    idea_description = Column(Text)
    stage = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Model
class WaitlistRequest(BaseModel):
    name: str
    email: str
    role: str
    idea_description: str
    stage: str = None

@app.get("/")
async def root():
    return {"message": "UltraNova Backend Running with SQLite"}

@app.post("/waitlist/join")
async def join_waitlist(request: WaitlistRequest):
    db = SessionLocal()
    
    try:
        # Check if email exists
        existing = db.query(WaitlistUser).filter(
            WaitlistUser.email == request.email
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Save to database
        new_user = WaitlistUser(
            name=request.name,
            email=request.email,
            role=request.role,
            idea_description=request.idea_description,
            stage=request.stage
        )
        
        db.add(new_user)
        db.commit()
        
        return {
            "status": "success",
            "message": "Successfully joined waitlist"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)