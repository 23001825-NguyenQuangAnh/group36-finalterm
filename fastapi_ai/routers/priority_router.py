# routers/priority_router.py

from fastapi import APIRouter
from schemas.priority_schema import PriorityRequest, PriorityResponse
from services.priority_service import analyze_priority

router = APIRouter(
    prefix="/priority",
    tags=["Priority Analysis"]
)


@router.post("/analyze", response_model=PriorityResponse)
def analyze_priority_route(request: PriorityRequest):
    """
    API chính để Spring Boot gọi sang FastAPI.
    
    Nhận các trường:
    - title
    - description

    Trả về:
    - categoryName (AI phân loại)
    - urgency (AI dự đoán)
    - importance (AI dự đoán)
    - parsedDeadline (AI phân tích)
    - priorityScore (tính toán từ urgency & importance)
    """
    result = analyze_priority(
        title=request.title,
        description=request.description
    )
    return result
