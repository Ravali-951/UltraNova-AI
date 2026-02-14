from app.db.models import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.founder import FounderInput
from app.core.founder_core import FounderCore
from app.security.dependencies import get_current_user

app = FastAPI(title="Ultra Nova v1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

core = FounderCore()

@app.get("/health")
def health():
    return {"status":"ok"}

@app.post("/founder/think")
def think(data: FounderInput, user=Depends(get_current_user)):
    return core.process(data)
