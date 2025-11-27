# routers/priority_router.py

from fastapi import APIRouter
from schemas.priority_schema import PriorityRequest, PriorityResponse
from services.priority_service import analyze_priority

# Khởi tạo router cho nhóm API /priority
router = APIRouter(
    prefix="/priority",
    tags=["Priority Analysis"]   # Tag để hiển thị nhóm API trên Swagger UI
)


@router.post("/analyze", response_model=PriorityResponse)
def analyze_priority_route(request: PriorityRequest):
    """
    Endpoint chính để Spring Boot gọi sang FastAPI.

    Nhận dữ liệu đầu vào từ FE/BE:
    - title: tiêu đề task
    - description: mô tả task

    Nhiệm vụ của API:
    - Gửi title + description sang mô hình AI
    - AI phân tích và trả về:
        • categoryName: loại task
        • urgency: mức độ khẩn cấp
        • importance: mức độ quan trọng
        • parsedDeadline: deadline mà AI trích xuất được (nếu có)
        • priorityScore: điểm ưu tiên tính toán từ urgency & importance

    → API này đóng vai trò trung gian giữa Spring Boot và mô hình ML.
    """
    # Gọi hàm xử lý chính: phân tích dữ liệu bằng mô hình AI
    result = analyze_priority(
        title=request.title,
        description=request.description
    )

    # Trả về kết quả dưới dạng PriorityResponse
    return result
