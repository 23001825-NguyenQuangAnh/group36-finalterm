from fastapi import APIRouter
from schemas.assistant_schema import (
    AssistantRequest,
    AssistantResponse,
    AssistantTaskSuggestion,
    AssistantActionType
)
from services.priority_assistant_service import analyze_assistant_priority

router = APIRouter(prefix="/assistant", tags=["assistant"])


# ============================
# INTENT DETECTION
# ============================
def detect_intent(message: str):
    msg = message.lower()

    # --- Intent: hỏi task hôm nay ---
    if any(key in msg for key in [
        "hôm nay tôi có task gì",
        "task hôm nay",
        "việc hôm nay",
        "việc cần làm hôm nay",
        "hôm nay phải làm gì",
        "today tasks",
        "today task",
        "cần làm hôm nay"
    ]):
        return AssistantActionType.SHOW_TODAY_TASKS

    # --- Intent: hỏi task quá hạn ---
    if any(key in msg for key in [
        "quá hạn",
        "overdue",
        "trễ deadline",
        "deadline trễ",
        "task bị trễ",
        "task quá hạn",
        "những task quá hạn",
        "việc quá hạn"
    ]):
        return AssistantActionType.SHOW_OVERDUE_TASKS

    # --- Default: Tạo task ---
    return AssistantActionType.CREATE_TASK


# ============================
# ASSISTANT CHAT ENDPOINT
# ============================
@router.post("", response_model=AssistantResponse)
def assistant_chat(req: AssistantRequest):
    text = req.message.strip()

    # 1) Detect intent BEFORE NLP
    intent = detect_intent(text)

    # === TASK HÔM NAY ===
    if intent == AssistantActionType.SHOW_TODAY_TASKS:
        return AssistantResponse(
            reply="Đây là các task bạn cần làm hôm nay nhé:",
            action=AssistantActionType.SHOW_TODAY_TASKS,
            task=None
        )

    # === TASK QUÁ HẠN ===
    if intent == AssistantActionType.SHOW_OVERDUE_TASKS:
        return AssistantResponse(
            reply="Dưới đây là các task đang bị quá hạn ⏰:",
            action=AssistantActionType.SHOW_OVERDUE_TASKS,
            task=None
        )

    # 2) Default: NLP → tạo task
    result = analyze_assistant_priority(text)

    suggestion = AssistantTaskSuggestion(
        title=result["title"],
        description=result["description"],
        categoryName=result["categoryName"],
        importance=result["importance"],
        urgency=result["urgency"],
        priorityScore=result["priorityScore"],
        durationMinutes=result["durationMinutes"],
        parsedDeadline=result["parsedDeadline"]
    )

    reply_text = (
        "Mình đã phân tích yêu cầu của bạn:\n"
        f"- 📝 Tiêu đề: {suggestion.title}\n"
        f"- 📂 Category: {suggestion.categoryName}\n"
        f"- ⏳ Importance: {suggestion.importance}\n"
        f"- ⚡ Urgency: {suggestion.urgency}\n"
        f"- ⭐ PriorityScore: {suggestion.priorityScore}\n"
        f"- ⏱ Duration: {suggestion.durationMinutes} phút\n"
        f"- 🕒 Deadline: {suggestion.parsedDeadline}\n\n"
        "Bạn muốn tạo task này không?"
    )

    return AssistantResponse(
        reply=reply_text,
        action=AssistantActionType.CREATE_TASK,
        task=suggestion
    )
