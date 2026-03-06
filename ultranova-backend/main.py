from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import uuid
import os

load_dotenv()
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

# ===== NEW CODE ADDED =====
class ThinkRequest(BaseModel):
    idea: str
    business_id: str = None
    runway_months: int = 12
    product_clarity: int = 5
    features: list = []

@app.post("/founder/think")
async def founder_think(request: ThinkRequest):
    """
    Using FREE Groq AI instead of OpenAI!
    """
    import random
    import json
    from groq import Groq
    
    # Initialize Groq client with your API key
    client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    
    try:
        # Call Groq (it's super fast and FREE!)
        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",  # Free powerful model!
            messages=[
                {"role": "system", "content": """You are UltraNova, an AI Co-Founder analyzing startup ideas.

You MUST return a COMPLETE JSON with ALL these fields. EVERY field should be DIFFERENT for each idea.

{
    "marketing": {
        "message": "detailed marketing analysis for this specific idea",
        "confidence": 65,
        "stance": "Optimistic",
        "vote": "A"
    },
    "product": {
        "message": "detailed product analysis for this specific idea", 
        "confidence": 72,
        "stance": "Excited",
        "vote": "B"
    },
    "sales": {
        "message": "detailed sales analysis for this specific idea",
        "confidence": 68,
        "stance": "Confident",
        "vote": "A"
    },
    "tech": {
        "message": "detailed tech analysis for this specific idea",
        "confidence": 88,
        "stance": "Confident",
        "vote": "B"
    },
    "ops": {
        "message": "detailed ops analysis for this specific idea",
        "confidence": 91,
        "stance": "Ready",
        "vote": "B"
    },
    "decision_question": "The key decision question for this idea",
    "overall_confidence": 75,
    "options": [
        {
            "label": "Option 1 unique to this idea",
            "confidence": 85,
            "risk": 15,
            "description": "Description of option 1",
            "votes": {
                "marketing": "A",
                "product": "B",
                "sales": "A",
                "tech": "B",
                "ops": "B"
            }
        },
        {
            "label": "Option 2 unique to this idea",
            "confidence": 72,
            "risk": 30,
            "description": "Description of option 2",
            "votes": {
                "marketing": "A",
                "product": "A",
                "sales": "B",
                "tech": "A",
                "ops": "A"
            }
        },
        {
            "label": "Option 3 unique to this idea",
            "confidence": 58,
            "risk": 45,
            "description": "Description of option 3",
            "votes": {
                "marketing": "B",
                "product": "C",
                "sales": "B",
                "tech": "C",
                "ops": "B"
            }
        }
    ]
}

Make EVERY field unique for each idea. Be specific and actionable.
"""},
                {"role": "user", "content": f"Analyze this startup idea and return COMPLETE JSON: {request.idea}"}
            ],
            temperature=0.8,
            max_tokens=3000,
        )
        
        # Get the response text
        result_text = response.choices[0].message.content
        print("Raw response:", result_text[:200] + "...")
        
        # Try to parse JSON from the response
        try:
            # Find JSON in the response (it might be wrapped in markdown)
            import re
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
            else:
                result = json.loads(result_text)
            
            print("✅ AI Generated successfully!")
            return result
            
        except json.JSONDecodeError:
            print("❌ Could not parse JSON, using fallback")
            # If JSON parsing fails, use fallback
            return generate_fallback_response(request.idea)
        
    except Exception as e:
        print(f"❌ Groq Error: {e}")
        # Use fallback response
        return generate_fallback_response(request.idea)

# Add this helper function for fallback responses
def generate_fallback_response(idea):
    """Generate a fallback response when AI fails"""
    import random
    
    first_word = idea.split()[0] if idea.split() else "product"
    
    return {
        "marketing": {
            "message": f"Market for '{idea}' shows potential. Need 10 customer interviews to validate.",
            "confidence": random.randint(60, 80),
            "stance": random.choice(["Optimistic", "Cautious", "Excited"]),
            "vote": random.choice(["A", "B", "C"])
        },
        "product": {
            "message": f"Focus on 3 core features for {first_word} MVP. Don't overbuild.",
            "confidence": random.randint(70, 90),
            "stance": random.choice(["Excited", "Confident", "Careful"]),
            "vote": random.choice(["A", "B", "C"])
        },
        "sales": {
            "message": f"Freemium model could work for {first_word}. Consider $9-19/month for premium.",
            "confidence": random.randint(60, 85),
            "stance": random.choice(["Confident", "Unsure", "Optimistic"]),
            "vote": random.choice(["A", "B", "C"])
        },
        "tech": {
            "message": f"Build {first_word} with Next.js + FastAPI + PostgreSQL. Start with cloud hosting.",
            "confidence": random.randint(80, 95),
            "stance": random.choice(["Confident", "Technical", "Ready"]),
            "vote": random.choice(["A", "B", "C"])
        },
        "ops": {
            "message": f"Need 1 developer and 1 marketer for {first_word}. Bootstrap first 3 months.",
            "confidence": random.randint(75, 92),
            "stance": random.choice(["Ready", "Careful", "Planning"]),
            "vote": random.choice(["A", "B", "C"])
        },
        "decision_question": f"Should we build the {first_word} MVP with core features or add extras?",
        "overall_confidence": random.randint(65, 88),
        "options": [
            {
                "label": f"Build {first_word} MVP with core features only",
                "confidence": random.randint(80, 92),
                "risk": random.randint(10, 20),
                "description": f"Launch quickly with must-have {first_word} features",
                "votes": {
                    "marketing": random.choice(["A", "B"]),
                    "product": random.choice(["A", "B"]),
                    "sales": random.choice(["A", "B"]),
                    "tech": random.choice(["A", "B"]),
                    "ops": random.choice(["A", "B"])
                }
            },
            {
                "label": f"Add analytics to track {first_word} usage",
                "confidence": random.randint(65, 82),
                "risk": random.randint(25, 35),
                "description": f"Measure everything in {first_word} from day 1",
                "votes": {
                    "marketing": random.choice(["A", "B", "C"]),
                    "product": random.choice(["A", "B"]),
                    "sales": random.choice(["A", "B"]),
                    "tech": random.choice(["A", "B"]),
                    "ops": random.choice(["A", "B"])
                }
            },
            {
                "label": f"Launch full {first_word} platform with all features",
                "confidence": random.randint(50, 68),
                "risk": random.randint(40, 52),
                "description": f"Go big with complete {first_word} solution",
                "votes": {
                    "marketing": random.choice(["B", "C"]),
                    "product": random.choice(["B", "C"]),
                    "sales": random.choice(["B", "C"]),
                    "tech": random.choice(["B", "C"]),
                    "ops": random.choice(["B", "C"])
                }
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)