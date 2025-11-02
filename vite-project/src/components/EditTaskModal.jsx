// src/components/EditTaskModal.jsx
import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants.js';

// MỚI: Component này nhận 'task' để chỉnh sửa
function EditTaskModal({ task, onUpdateTask, onClose }) {
  // State nội bộ, được khởi tạo từ 'task' prop
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(""); 
  const [deadline, setDeadline] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [importance, setImportance] = useState(5); 

  // MỚI: Dùng useEffect để điền dữ liệu khi 'task' prop được truyền vào
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || ""); // Đảm bảo không phải 'null'
      setCategoryId(task.categoryId);
      setDeadline(task.deadline || ""); // Đảm bảo không phải 'null'
      setEstimatedDuration(task.durationMins);
      setImportance(task.importance);
    }
  }, [task]); // Chạy lại khi 'task' thay đổi

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Vui lòng nhập tên task!");
      return;
    }
    if (!categoryId) {
      alert("Vui lòng chọn phân loại cho task!");
      return;
    }
    
    // MỚI: Tạo object dữ liệu đã cập nhật
    const updatedTaskData = {
      title: title.trim(),
      description: description.trim() || null,
      categoryId: categoryId,
      deadline: deadline || null,
      durationMins: Number(estimatedDuration) || 60,
      importance: Number(importance) || 5,
    };
    
    // MỚI: Gọi hàm 'onUpdateTask' với ID của task cũ và dữ liệu mới
    onUpdateTask(task.id, updatedTaskData);
    onClose(); 
  };

  // Nếu không có task, không render gì cả (tránh lỗi)
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-50">
        {/* SỬA: Tiêu đề */}
        <h3 className="text-lg font-medium mb-4">Chi tiết / Chỉnh sửa Task</h3>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Tên Task */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Task
            </label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ví dụ: Hoàn thành báo cáo AI" 
              className="px-3 py-2 border rounded w-full outline-none" 
            />
          </div>
          
          {/* Phân loại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phân loại
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3 py-2 border rounded w-full bg-white outline-none"
            >
              <option value="">-- Chọn phân loại --</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Miêu tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miêu tả 
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm mô tả chi tiết cho công việc..."
              className="px-3 py-2 border rounded w-full outline-none" 
              rows="3"
            ></textarea>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline (Thời gian nộp)
            </label>
            <input 
              value={deadline} 
              onChange={(e) => setDeadline(e.target.value)} 
              type="date" 
              className="px-3 py-2 border rounded w-full outline-none" 
            />
          </div>

          {/* Độ quan trọng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ quan trọng: <span className="font-bold">{importance}</span>/10
            </label>
            <input
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
              type="range"
              min="1"
              max="10"
              className="w-full "
            />
          </div>

          {/* Thời gian ước lượng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian ước lượng (phút)
            </label>
            <input 
              value={estimatedDuration} 
              onChange={(e) => setEstimatedDuration(e.target.value)} 
              type="number"
              max ="1440" 
              min="1"
              className="px-3 py-2 border rounded w-full outline-none" 
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Hủy</button>
          {/* SỬA: Nút 'Cập nhật' */}
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Cập nhật</button>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;