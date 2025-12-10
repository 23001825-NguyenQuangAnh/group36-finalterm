// AddTaskModal.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";

function AddTaskModal({ onAddTask, onClose, categories }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [priorityLevel, setPriorityLevel] = useState("NORMAL");

  const [aiResult, setAiResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [usedAiSuggestion, setUsedAiSuggestion] = useState(false);

  // Date không lệch timezone
  const formatLocalDateTime = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(
      2,
      "0"
    )}:${String(d.getMinutes()).padStart(2, "0")}:00`;
  };

  // Gọi AI
  const analyzeWithAI = async () => {
    if (!title.trim() && !description.trim()) {
      toast.error("Hãy nhập tiêu đề hoặc mô tả để AI phân tích!");
      return;
    }

    try {
      setLoadingAI(true);

      const res = await axios.post("http://localhost:8000/priority/analyze", {
        title,
        description,
      });

      const ai = res.data.result || res.data;

      setAiResult({
        categoryName: ai.categoryName,
        priorityScore: ai.priorityScore,
        durationMinutes: ai.durationMinutes,
      });

      setUsedAiSuggestion(false);
    } catch (err) {
      toast.error("AI gặp lỗi!");
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  // === SỬA 1: ÁP DỤNG GỢI Ý AI ===
  const applyAiSuggestion = () => {
    if (!aiResult) return;

    const matched = categories.find(
      (c) => c.name.toLowerCase() === aiResult.categoryName.toLowerCase()
    );

    if (matched) {
      setCategoryId(matched.id);
    } else {
      toast.error(
        `Không tìm thấy phân loại "${aiResult.categoryName}" trong hệ thống!`
      );
    }

    setPriorityLevel(aiResult.priorityScore >= 0.6 ? "HIGH" : "NORMAL");

    if (aiResult.durationMinutes) {
      setEstimatedDuration(aiResult.durationMinutes);
    }

    setUsedAiSuggestion(true);
    toast.success("Đã áp dụng gợi ý từ AI ✅");
  };

  // === SỬA 2: NÚT BỎ QUA — RESET AI RESULT ===
  const discardAiSuggestion = () => {
    setAiResult(null);
    setUsedAiSuggestion(false);
  };

  // Submit
  const handleSubmit = () => {
    if (!title.trim()) return toast.error("Tên task không được bỏ trống!");
    if (!categoryId) return toast.error("Hãy chọn phân loại!");

    const formattedDeadline = formatLocalDateTime(deadline);

    const finalPriorityScore =
      usedAiSuggestion && aiResult ? aiResult.priorityScore : null;

    const newTask = {
      title,
      description,
      durationMinutes: Number(estimatedDuration),
      deadline: formattedDeadline,
      priorityLevel,
      categoryId: Number(categoryId),
      priorityScore: finalPriorityScore,
    };

    onAddTask(newTask);

    // reset
    setTitle("");
    setDescription("");
    setDeadline(null);
    setCategoryId("");
    setPriorityLevel("NORMAL");
    setEstimatedDuration(60);
    setAiResult(null);

    toast.success("Đã thêm task!");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium mb-4">Thêm Task Mới</h3>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Task
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`px-3 py-2 border rounded w-full ${
                usedAiSuggestion ? "border-green-400" : ""
              }`}
              placeholder="Ví dụ: Hoàn thành báo cáo AI"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miêu tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-3 py-2 border rounded w-full"
              rows="3"
              placeholder="Mô tả chi tiết công việc..."
            />
          </div>

          {/* AI BUTTON */}
          <button
            onClick={analyzeWithAI}
            disabled={loadingAI}
            className={`px-3 py-2 w-full rounded text-white transition ${
              loadingAI
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loadingAI ? "Đang phân tích..." : "🔮 Phân tích với AI"}
          </button>

          {/* === SỬA 3: KHỐI GỢI Ý AI + 2 NÚT === */}
          {aiResult && (
            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
              <h4 className="font-semibold text-purple-700">Gợi ý từ AI</h4>
              <p>
                📌 Category: <b>{aiResult.categoryName}</b>
              </p>
              <p>
                🔥 Priority Score: <b>{aiResult.priorityScore.toFixed(2)}</b>
              </p>
              <p>
                ⏳ Thời gian dự kiến: <b>{aiResult.durationMinutes} phút</b>
              </p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={applyAiSuggestion}
                  className="px-3 py-1 bg-purple-600 text-white rounded"
                >
                  Dùng gợi ý
                </button>

                <button
                  onClick={discardAiSuggestion}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phân loại
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3 py-2 border rounded w-full bg-white"
            >
              <option value="">-- Chọn phân loại --</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* DEADLINE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              className="px-3 py-2 border rounded w-full bg-white"
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              minDate={new Date()}
            />
          </div>

          {/* PRIORITY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mức độ ưu tiên
            </label>
            <select
              value={priorityLevel}
              onChange={(e) => setPriorityLevel(e.target.value)}
              className="px-3 py-2 border rounded w-full bg-white"
            >
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          {/* DURATION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian ước lượng (phút)
            </label>
            <input
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              type="number"
              min="1"
              max="1440"
              className="px-3 py-2 border rounded w-full"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thêm Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskModal;
