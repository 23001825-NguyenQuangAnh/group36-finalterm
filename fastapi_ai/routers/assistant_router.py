from fastapi import APIRouter
from schemas.assistant_schema import (
    AssistantRequest,
    AssistantResponse,
    AssistantTaskSuggestion,
    AssistantActionType
)
from services.priority_assistant_service import analyze_assistant_priority

router = APIRouter(prefix="/assistant", tags=["assistant"])
# Router FastAPI cho nhóm API /assistant, phục vụ các chức năng chat assistant


# ============================
# INTENT DETECTION
# → Hàm phát hiện ý định của người dùng dựa trên từ khóa trong câu
# ============================
def detect_intent(message: str):
    msg = message.lower()   # Chuẩn hóa chuỗi về chữ thường để so khớp từ khóa tốt hơn

    # --- Intent: hỏi task hôm nay ---
    # Kiểm tra xem message có chứa bất kỳ từ khóa nào thuộc nhóm “task hôm nay”
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
    # Phát hiện người dùng đang muốn xem danh sách task bị trễ deadline
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
    # Nếu không khớp intent nào → mặc định coi như người dùng muốn tạo task mới
    return AssistantActionType.CREATE_TASK


# ============================
# ASSISTANT CHAT ENDPOINT
# → Endpoint chính xử lý tin nhắn người dùng trong Chat Assistant
# ============================
@router.post("", response_model=AssistantResponse)
def assistant_chat(req: AssistantRequest):
    text = req.message.strip()  # Lấy nội dung câu nói và bỏ khoảng trắng dư thừa

    # 1) Detect intent BEFORE NLP
    # Nhận dạng ý định trước khi gửi đi phân tích NLP
    intent = detect_intent(text)

    # === TASK HÔM NAY ===
    # Trả về phản hồi dành cho intent xem task hôm nay
    if intent == AssistantActionType.SHOW_TODAY_TASKS:
        return AssistantResponse(
            reply="Đây là các task bạn cần làm hôm nay nhé:",
            action=AssistantActionType.SHOW_TODAY_TASKS,
            task=None  # Không trả về task gợi ý
        )

    # === TASK QUÁ HẠN ===
    # Trả về phản hồi cho intent xem task quá hạn
    if intent == AssistantActionType.SHOW_OVERDUE_TASKS:
        return AssistantResponse(
            reply="Dưới đây là các task đang bị quá hạn ⏰:",
            action=AssistantActionType.SHOW_OVERDUE_TASKS,
            task=None
        )

    # 2) Default: NLP → tạo task
    # Nếu không phải intent đặc biệt → gửi sang NLP service phân tích tạo task
    result = analyze_assistant_priority(text)

    # Tạo object gợi ý task từ kết quả phân tích NLP
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

    # Gửi phản hồi mô tả chi tiết task đã được AI phân tích
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

    # Trả về response chứa thông tin AI gợi ý và yêu cầu xác nhận tạo task
    return AssistantResponse(
        reply=reply_text,
        action=AssistantActionType.CREATE_TASK,
        task=suggestion
    )
