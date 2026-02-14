
from datetime import datetime, timedelta
from jose import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET","secret")
ALGORITHM = "HS256"

def create_token(user_id:str):
    payload={"sub":user_id,"exp":datetime.utcnow()+timedelta(hours=12)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
