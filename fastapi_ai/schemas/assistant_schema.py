# schemas/assistant_schema.py
from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel


# =============================
# Action types AI trả về
# =============================
class AssistantActionType(str, Enum):
    NONE = "NONE"

    # Tạo task
    CREATE_TASK = "CREATE_TASK"

    # Xem task hôm nay
    SHOW_TODAY_TASKS = "SHOW_TODAY_TASKS"   # ⭐ BẠN THÊM MỚI

    # Xem các task quá hạn
    SHOW_OVERDUE_TASKS = "SHOW_OVERDUE_TASKS"



# =============================
# Task suggestion (Pipeline 2)
# =============================
class AssistantTaskSuggestion(BaseModel):
    title: str
    description: Optional[str] = None

    categoryName: Optional[str] = None

    importance: Optional[float] = None
    urgency: Optional[float] = None
    priorityScore: Optional[float] = None

    durationMinutes: Optional[int] = None
    parsedDeadline: Optional[datetime] = None


# =============================
# Request
# =============================
class AssistantRequest(BaseModel):
    userId: Optional[int] = None
    message: str


# =============================
# Response
# =============================
class AssistantResponse(BaseModel):
    reply: str
    action: AssistantActionType
    task: Optional[AssistantTaskSuggestion] = None
    filters: Optional[Dict[str, Any]] = None
