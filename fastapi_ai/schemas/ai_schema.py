# Định nghĩa cấu trúc dữ liệu (schema) — dùng để xác thực input/output (Pydantic models).

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# 1️⃣ Request model (Spring Boot → FastAPI)
class AiAnalysisRequest(BaseModel):
    raw_description: str  # tương ứng với rawDescription trong Java

# 2️⃣ Response model (FastAPI → Spring Boot)
class AiAnalysisResponse(BaseModel):
    id: Optional[int] = None
    raw_description: str
    parsed_deadline: Optional[datetime] = None
    urgency: Optional[float] = None
    importance: Optional[float] = None
    priority_score: Optional[float] = None
    category: Optional[str] = None
    created_at: Optional[datetime] = None
    task_id: Optional[int] = None

    class Config:
        from_attributes = True  # Cho phép parse từ SQLAlchemy model
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }
