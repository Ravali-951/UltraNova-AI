
from sqlalchemy import Column, String, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime, uuid

Base = declarative_base()

class Decision(Base):
    __tablename__ = "decisions"
    id = Column(String, primary_key=True, default=lambda:str(uuid.uuid4()))
    business_id = Column(String)
    decision = Column(JSON)
    context = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
