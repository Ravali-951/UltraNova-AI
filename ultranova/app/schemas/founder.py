
from pydantic import BaseModel
from typing import List

class FounderInput(BaseModel):
    idea: str
    business_id: str
    personality: str = "balanced"
    runway_months: int = 12
    product_clarity: bool = True
    requested_features: List[str] = []
