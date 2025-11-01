import React, { useState, useEffect } from "react";
import { CATEGORIES } from "../constants.js";

export default function EditTaskModal({ task, onUpdateTask, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [importance, setImportance] = useState(5);

  // 🧭 Điền dữ liệu từ prop
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setCategoryId(task.categoryId);
      setDeadline(task.deadline || "");
      setEstimatedDuration(task.durationMins || 60);
      setImportance(task.importance || 5);
    }
  }, [task]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("⚠️ Vui lòng nhập tên task!");
      return;
    }
    if (!categoryId) {
      alert("⚠️ Vui lòng chọn phân loại cho task!");
      return;
    }

    const updatedTaskData = {
      title: title.trim(),
      description: description.trim() || null,
      categoryId,
      deadline: deadline || null,
      durationMins: Number(estimatedDuration),
      importance: Number(importance),
    };

    onUpdateTask(task.id, updatedTaskData);
    alert("✅ Task đã được cập nhật!");
    onClose();
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 p-4 transition-all">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-50 border border-gray-100 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Chi tiết / Chỉnh sửa Task
        </h3>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
          {/* --- Tên Task --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Task <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Hoàn thành báo cáo AI"
              className="px-3 py-2 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
          </div>

          {/* --- Phân loại --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phân loại <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3 py-2 border rounded-lg w-full bg-white text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            >
              <option value="">-- Chọn phân loại --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* --- Miêu tả --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miêu tả (Không bắt buộc)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm mô tả chi tiết cho công việc..."
              rows="3"
              className="px-3 py-2 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            ></textarea>
          </div>

          {/* --- Deadline --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline (Thời gian nộp)
            </label>
            <input
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              type="date"
              className="px-3 py-2 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
          </div>

          {/* --- Độ quan trọng --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ quan trọng:{" "}
              <span className="font-semibold text-blue-600">{importance}</span>
              /10
            </label>
            <input
              value={importance}
              onChange={(e) => setImportance(Number(e.target.value))}
              type="range"
              min="1"
              max="10"
              className="w-full accent-blue-600"
            />
          </div>

          {/* --- Thời gian ước lượng --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian ước lượng (phút)
            </label>
            <input
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              type="number"
              min="1"
              className="px-3 py-2 border rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
          </div>
        </div>

        {/* --- Nút hành động --- */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
