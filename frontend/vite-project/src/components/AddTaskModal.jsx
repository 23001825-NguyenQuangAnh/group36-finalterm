import React, { useState } from 'react';
// Import hằng số CATEGORIES từ file constants (đi ra 1 cấp)
import { CATEGORIES } from '../constants.js';

// --- Component AddTaskModal (Đã tách file) ---
function AddTaskModal({ onAddTask, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(""); 
  const [deadline, setDeadline] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [importance, setImportance] = useState(5); 

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Vui lòng nhập tên task!");
      return;
    }
    // Bắt buộc chọn phân loại
    if (!categoryId) {
      alert("Vui lòng chọn phân loại cho task!");
      return;
    }
    
    // Gửi tất cả dữ liệu mới lên
    onAddTask(title, description, categoryId, deadline, estimatedDuration, importance);
    onClose(); // Tự động đóng modal sau khi thêm
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-50">
        <h3 className="text-lg font-medium mb-4">Thêm Task Mới</h3>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Tên Task (Bắt buộc) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Task (Bắt buộc)
            </label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ví dụ: Hoàn thành báo cáo AI" 
              className="px-3 py-2 border rounded w-full" 
            />
          </div>
          
          {/* Phân loại (Bắt buộc) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phân loại (Bắt buộc)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3 py-2 border rounded w-full bg-white"
            >
              <option value="">-- Chọn phân loại --</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Miêu tả (Không bắt buộc) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Miêu tả (Không bắt buộc)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm mô tả chi tiết cho công việc..."
              className="px-3 py-2 border rounded w-full"
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
              className="px-3 py-2 border rounded w-full" 
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
              className="w-full"
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
              className="px-3 py-2 border rounded w-full" 
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Hủy</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Thêm Task</button>
        </div>
      </div>
    </div>
  );
}

// Export component để file khác có thể dùng
export default AddTaskModal;