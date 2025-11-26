from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class PriorityRequest(BaseModel):
    title: str
    description: str


class PriorityResponse(BaseModel):
    categoryName: str
    urgency: float
    importance: float
    parsedDeadline: Optional[datetime] = None
    durationMinutes: float
    priorityScore: float
