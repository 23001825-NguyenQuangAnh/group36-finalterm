import React, { useState, useRef, useEffect } from "react";
import { chatWithAssistant } from "../api/assistantApi";
import { createTask, getTodayTasks, getOverdueTasks } from "../api/taskApi";
import toast from "react-hot-toast";

export default function ChatAssistant({ onTaskCreated }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id || null;

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "Xin chào 👋\nMình là trợ lý Task AI.\nBạn có thể thử:\n" +
        "- Tạo task đi chợ mua rau thịt vào chiều mai\n" +
        "- Hôm nay tôi có task gì?\n" +
        "- Tôi có task nào quá hạn không?\n",
    },
  ]);

  const [input, setInput] = useState("");
  const [pendingTask, setPendingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pendingTask]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Thêm user message vào
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setLoading(true);

    try {
      const res = await chatWithAssistant(input, userId);
      const data = res.data;

      // Bot trả lời
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);

      // ======================================================
      // ⭐ 1) SHOW_TODAY_TASKS
      // ======================================================
      if (data.action === "SHOW_TODAY_TASKS") {
        try {
          const resToday = await getTodayTasks(userId);
          let tasks = resToday.data.result;

          // Lọc COMPLETED
          tasks = tasks.filter((t) => t.status?.toUpperCase() !== "COMPLETED");

          if (!tasks || tasks.length === 0) {
            setMessages((prev) => [
              ...prev,
              { from: "bot", text: "Hôm nay bạn không có task nào 🎉" },
            ]);
          } else {
            const formatted = tasks
              .map(
                (t, i) =>
                  `${i + 1}. ${t.title}\n   🕒 Deadline: ${
                    t.deadline || "Không có"
                  }\n   ⭐ Priority: ${t.priorityLevel}`
              )
              .join("\n\n");

            setMessages((prev) => [...prev, { from: "bot", text: formatted }]);
          }
        } catch (err) {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Không thể tải danh sách task hôm nay 😢" },
          ]);
        }

        setLoading(false);
        setInput("");
        return;
      }

      // ======================================================
      // ⭐ 2) SHOW_OVERDUE_TASKS
      // ======================================================
      if (data.action === "SHOW_OVERDUE_TASKS") {
        try {
          const resOverdue = await getOverdueTasks(userId);
          let tasks = resOverdue.data.result;

          // Lọc COMPLETED
          tasks = tasks.filter((t) => t.status?.toUpperCase() !== "COMPLETED");

          if (!tasks || tasks.length === 0) {
            setMessages((prev) => [
              ...prev,
              { from: "bot", text: "Bạn không có task nào quá hạn 🎉" },
            ]);
          } else {
            const formatted = tasks
              .map(
                (t, i) =>
                  `${i + 1}. ${t.title}\n   ⏰ Deadline: ${
                    t.deadline || "Không có"
                  }\n   ⭐ Priority: ${t.priorityLevel}`
              )
              .join("\n\n");

            setMessages((prev) => [...prev, { from: "bot", text: formatted }]);
          }
        } catch (err) {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Không thể tải task quá hạn 😢" },
          ]);
        }

        setLoading(false);
        setInput("");
        return;
      }

      // ======================================================
      // ⭐ 3) CREATE_TASK suggestions (NLP)
      // ======================================================
      if (data.action === "CREATE_TASK" && data.task) {
        const priorityLevel =
          data.task.priorityScore >= 0.5 ? "HIGH" : "NORMAL";

        setPendingTask({
          ...data.task,
          priorityLevel: priorityLevel,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể kết nối với trợ lý AI");
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  // ======================================================
  // ⭐ Xác nhận tạo task từ gợi ý NLP
  // ======================================================
  const handleCreateFromSuggestion = async () => {
    if (!pendingTask) return;

    try {
      await createTask({
        title: pendingTask.title,
        description: pendingTask.description,
        deadline: pendingTask.parsedDeadline,
        durationMinutes: pendingTask.durationMinutes,
        priorityLevel: pendingTask.priorityLevel,
      });

      toast.success("Đã tạo task từ gợi ý AI!");
      setPendingTask(null);

      if (onTaskCreated) onTaskCreated();
    } catch {
      toast.error("Không thể tạo task");
    }
  };

  return (
    <div className="flex flex-col h-[420px]">
      {/* MESSAGE BOX */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto border rounded-lg p-3 bg-gray-50 space-y-2"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg whitespace-pre-line text-sm max-w-[80%] ${
              msg.from === "user"
                ? "ml-auto bg-blue-100 text-gray-900"
                : "mr-auto bg-gray-200 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm italic">
            AI đang suy nghĩ...
          </div>
        )}
      </div>

      {/* AI TASK SUGGESTION */}
      {pendingTask && (
        <div className="mt-3 p-3 border rounded-lg bg-yellow-50 text-sm shadow-sm">
          <div className="font-semibold mb-1">Gợi ý task từ AI:</div>

          <div>
            - <strong>Tiêu đề:</strong> {pendingTask.title}
          </div>
          <div>
            - <strong>Mô tả:</strong> {pendingTask.description}
          </div>
          <div>
            - <strong>Category:</strong> {pendingTask.categoryName}
          </div>
          <div>
            - <strong>Deadline:</strong>{" "}
            {pendingTask.parsedDeadline || "Không có"}
          </div>
          <div>
            - <strong>Duration:</strong> {pendingTask.durationMinutes} phút
          </div>
          <div>
            - <strong>Priority:</strong>{" "}
            <span
              className={
                pendingTask.priorityLevel === "HIGH"
                  ? "text-red-600 font-semibold"
                  : "text-green-700 font-semibold"
              }
            >
              {pendingTask.priorityLevel}
            </span>
          </div>

          <button
            onClick={handleCreateFromSuggestion}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Tạo task từ gợi ý
          </button>
        </div>
      )}

      {/* INPUT BOX */}
      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Nhập yêu cầu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
