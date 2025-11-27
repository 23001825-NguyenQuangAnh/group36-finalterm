# schemas/assistant_schema.py
from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel


# =============================
# Action types AI trả về
# → Đây là các hành động mà Chat Assistant có thể yêu cầu FE thực hiện
# =============================
class AssistantActionType(str, Enum):
    NONE = "NONE"  # Không làm gì cả

    # Tạo task mới (khi AI phân tích được thông tin task)
    CREATE_TASK = "CREATE_TASK"

    # Xem danh sách task hôm nay
    SHOW_TODAY_TASKS = "SHOW_TODAY_TASKS"   # ⭐ Mục mở rộng trong assistant

    # Xem danh sách task đang bị quá hạn
    SHOW_OVERDUE_TASKS = "SHOW_OVERDUE_TASKS"



# =============================
# Task suggestion (Pipeline 2)
# → Kết quả AI phân tích từ câu nói tự nhiên của người dùng
# =============================
class AssistantTaskSuggestion(BaseModel):
    # Thông tin task được AI trích xuất
    title: str
    description: Optional[str] = None

    # Phân loại task do mô hình ML dự đoán
    categoryName: Optional[str] = None

    # Các chỉ số ML dự đoán
    importance: Optional[float] = None
    urgency: Optional[float] = None
    priorityScore: Optional[float] = None  # Điểm ưu tiên được AI tính

    # Thời gian ước lượng hoàn thành & deadline AI trích xuất
    durationMinutes: Optional[int] = None
    parsedDeadline: Optional[datetime] = None



# =============================
# Request
# → Dữ liệu từ FE gửi vào khi người dùng chat
# =============================
class AssistantRequest(BaseModel):
    userId: Optional[int] = None  # ID người dùng (nếu có)
    message: str                 # Nội dung người dùng nhập vào assistant



# =============================
# Response
# → Dữ liệu trả về cho frontend sau khi AI xử lý
# =============================
class AssistantResponse(BaseModel):
    reply: str                                  # Tin nhắn assistant trả về để hiển thị
    action: AssistantActionType                 # Loại hành động assistant yêu cầu frontend làm
    task: Optional[AssistantTaskSuggestion] = None  # Nếu action là CREATE_TASK → chứa thông tin task AI gợi ý
    filters: Optional[Dict[str, Any]] = None        # Dùng cho intent lọc task nếu cần (mở rộng)
