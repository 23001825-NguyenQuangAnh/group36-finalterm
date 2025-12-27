from datetime import datetime
from pydantic import BaseModel
from typing import Optional


# =============================
# Request gửi từ Spring Boot sang FastAPI
# → Chứa dữ liệu người dùng nhập khi tạo task thủ công
# =============================
class PriorityRequest(BaseModel):
    title: str          # Tiêu đề task
    description: str    # Mô tả chi tiết task


# =============================
# Response FastAPI trả về sau khi phân tích bằng AI
# → Gồm các trường được mô hình ML dự đoán hoặc tính toán
# =============================
class PriorityResponse(BaseModel):
    categoryName: str               # Tên category do mô hình phân loại
    urgency: float                  # Mức độ khẩn cấp (ML dự đoán)
    importance: float               # Mức độ quan trọng (ML dự đoán)
    parsedDeadline: Optional[datetime] = None  # Deadline AI trích xuất từ mô tả (nếu có)
    durationMinutes: float          # Thời gian ước lượng hoàn thành task
    priorityScore: float            # Điểm ưu tiên = hàm kết hợp urgency + importance
