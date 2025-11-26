# schemas/nlp_schema.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NLPRequest(BaseModel):
    title: str
    description: str
    durationMinutes: Optional[int] = None  # để đó dùng sau nếu muốn


class NLPResponse(BaseModel):
    categoryName: str
    urgency: float
    importance: float
    parsedDeadline: Optional[datetime] = None
