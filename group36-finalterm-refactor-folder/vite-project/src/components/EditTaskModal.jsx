// src/components/EditTaskModal.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

function EditTaskModal({ task, onUpdateTask, onClose, categories }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [priorityLevel, setPriorityLevel] = useState("NORMAL");

  // ⭐ Format LocalDateTime KHÔNG đổi timezone
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

  // LOAD TASK BAN ĐẦU
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setCategoryId(task.categoryId ? Number(task.categoryId) : null);
      setDurationMinutes(task.durationMinutes || 60);
      setPriorityLevel(task.priorityLevel || "NORMAL");

      if (task.deadline) setDeadline(new Date(task.deadline));
    }
  }, [task]);

  // SUBMIT
  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên task!");
      return;
    }
    if (!categoryId) {
      toast.error("Vui lòng chọn phân loại!");
      return;
    }

    const formattedDeadline = formatLocalDateTime(deadline);

    const updatedTask = {
      title: title.trim(),
      description: description.trim() || null,
      categoryId: Number(categoryId),
      deadline: formattedDeadline,
      durationMinutes: Number(durationMinutes),
      priorityLevel,
    };

    onUpdateTask(task.id, updatedTask);
    toast.success("Cập nhật thành công!");
    onClose();
  };

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-medium mb-4">Chỉnh sửa Task</h3>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">Tên Task</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên công việc..."
              className="px-3 py-2 border rounded w-full outline-none"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-1">Phân loại</label>
            <select
              value={categoryId || ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="px-3 py-2 border rounded w-full bg-white outline-none cursor-pointer"
            >
              <option value="">-- Chọn phân loại --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">Miêu tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="px-3 py-2 border rounded w-full outline-none"
              placeholder="Ghi chú thêm về công việc..."
            ></textarea>
          </div>

          {/* DEADLINE */}
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              className="px-3 py-2 border rounded w-full outline-none bg-white cursor-pointer"
              placeholderText="Chọn ngày..."
              showTimeSelect
              timeIntervals={15}
              timeFormat="HH:mm"
              dateFormat="dd/MM/yyyy HH:mm"
            />
          </div>

          {/* PRIORITY */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mức độ ưu tiên
            </label>
            <select
              value={priorityLevel}
              onChange={(e) => setPriorityLevel(e.target.value)}
              className="px-3 py-2 border rounded w-full bg-white outline-none cursor-pointer"
            >
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          {/* DURATION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Thời gian ước lượng (phút)
            </label>
            <input
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              type="number"
              min="1"
              max="1440"
              className="px-3 py-2 border rounded w-full outline-none"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;
