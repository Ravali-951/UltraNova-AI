import resend
import os
from ai_agents import roadmap_agent, team_agent, decision_agent
from ai_agents import marketing_agent, product_agent, sales_agent, tech_agent, ops_agent
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")


def send_welcome_email(email, name):
    try:
        resend.Emails.send({
            "from": "UltraNova <onboarding@resend.dev>",
            "to": email,
            "subject": "Welcome to UltraNova 🚀",
            "html": f"""
            <h2>Welcome to UltraNova 🚀</h2>
            <p>Hi {name},</p>
            <p>Thanks for joining the UltraNova waitlist!</p>
            <p>We'll notify you when we launch.</p>
            """
        })
        print("Email sent successfully")

    except Exception as e:
        print("Email error:", e)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use SQLite
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


# Waitlist Request Model
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
        existing = db.query(WaitlistUser).filter(
            WaitlistUser.email == request.email
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        new_user = WaitlistUser(
            name=request.name,
            email=request.email,
            role=request.role,
            idea_description=request.idea_description,
            stage=request.stage
        )
        
        db.add(new_user)
        db.commit()

        # SEND WELCOME EMAIL HERE
        send_welcome_email(request.email, request.name)
        
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


# ================================
# THINK REQUEST MODEL
# ================================
class ThinkRequest(BaseModel):
    idea: str
    business_id: str = None
    runway_months: int = 12
    product_clarity: int = 5
    features: list = []


# ================================
# AI THINK ENDPOINT
# ================================
@app.post("/founder/think")
async def founder_think(request: ThinkRequest):

    idea = request.idea

    marketing = marketing_agent(idea)
    product = product_agent(idea)
    sales = sales_agent(idea)
    tech = tech_agent(idea)
    ops = ops_agent(idea)

    result = {
        "marketing": marketing,
        "product": product,
        "sales": sales,
        "tech": tech,
        "ops": ops,
        "decision_question": f"Should we build '{idea}' as an MVP first?",
        "overall_confidence": (
            marketing["confidence"]
            + product["confidence"]
            + sales["confidence"]
            + tech["confidence"]
            + ops["confidence"]
        ) // 5,
        "options": [
            {"label": "Build MVP fast", "confidence": 85, "risk": 20},
            {"label": "Build full product", "confidence": 70, "risk": 40},
            {"label": "Validate market first", "confidence": 78, "risk": 25},
        ],
    }

    return result


# ================================
# ROADMAP AI ENDPOINT
# ================================
@app.post("/founder/roadmap")
async def founder_roadmap(request: ThinkRequest):

    roadmap = roadmap_agent(request.idea)

    return roadmap


# ================================
# TEAM AI ENDPOINT
# ================================
@app.post("/founder/team")
async def founder_team(request: ThinkRequest):

    team = team_agent(request.idea)

    return team


# ================================
# DECISION AI ENDPOINT
# ================================
@app.post("/founder/decision")
async def founder_decision(request: ThinkRequest):

    decision = decision_agent(request.idea)

    return decision


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)