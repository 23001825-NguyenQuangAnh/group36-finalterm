# Gọi đến các service như nlp_service, priority_service, recommendation_service, v.v.
# Trả về JSON thống nhất (deadline, urgency, importance, priority_score, …)

from fastapi import APIRouter
from datetime import datetime, timedelta
from schemas.ai_schema import AiAnalysisRequest, AiAnalysisResponse
from services.priority_service import analyze_priority

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/analyze", response_model=AiAnalysisResponse)
def analyze_task(data: AiAnalysisRequest):
    """
    Nhận mô tả công việc từ Spring Boot, xử lý NLP + tính priority + deadline.
    """
    # Gọi hàm tính toán
    result = analyze_priority(data.raw_description)

    # Giả lập thời gian deadline được phân tích (ví dụ sau 3 ngày)
    parsed_deadline = datetime.now() + timedelta(days=3)

    return AiAnalysisResponse(
        raw_description=data.raw_description,
        parsed_deadline=result["parsed_deadline"],  
        urgency=result["urgency"],
        importance=result["importance"],
        priority_score=result["priority_score"],     
        category=result["category"],
        created_at=datetime.now(),
        task_id=None
    )
