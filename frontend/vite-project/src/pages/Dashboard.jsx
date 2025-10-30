import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants.js';
import AddTaskModal from '../components/AddTaskModal.jsx'; 
import TaskCard from '../components/TaskCard.jsx';
import { uid } from '../utils.js'; 

// --- Component Dashboard (Cập nhật) ---
export default function Dashboard({ tasks, setTasks }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const [sortBy, setSortBy] = useState("default"); 

  // (Các hàm logic giữ nguyên... addTask, moveTask, completeTask, restoreTask)
  const addTask = (title, description, categoryId, deadline, estimatedDuration, importance) => {
    const newTask = { 
      id: uid(), 
      title: title.trim(), 
      description: description.trim() || null,
      categoryId: categoryId,
      status: "pending", 
      durationMins: Number(estimatedDuration) || 60,
      deadline: deadline || null,
      importance: Number(importance) || 5,
      createdAt: Date.now() 
    };
    setTasks((s) => [newTask, ...s]);
    setIsModalOpen(false);
  };

  const moveTask = (task, status) => setTasks((s) => s.map((t) => (t.id === task.id ? { ...t, status } : t)));
  const completeTask = (task) => setTasks((s) => s.map((t) => (t.id === task.id ? { ...t, status: "completed" } : t)));
  const restoreTask = (task) => setTasks((s) => s.map((t) => (t.id === task.id ? { ...t, status: "pending" } : t)));


  // (Logic Lọc và Sắp xếp giữ nguyên... useMemo)
  const processedTasks = useMemo(() => {
    let filtered = tasks;

    // 1. Lọc theo Category
    if (selectedCategory !== 'All') {
      // Tìm ID của category được chọn
      const categoryId = CATEGORIES.find(c => c.name === selectedCategory)?.id;
      if (categoryId) {
        filtered = filtered.filter(t => t.categoryId === categoryId);
      }
    }

    // 2. Sắp xếp (tạo bản sao để tránh thay đổi state gốc)
    let sorted = [...filtered]; 
    if (sortBy === 'urgency') {
      // Sắp xếp theo deadline (gần nhất trước)
      // Task không có deadline sẽ bị đẩy xuống cuối
      sorted.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (sortBy === 'importance') {
      // Sắp xếp theo độ quan trọng (cao nhất trước)
      sorted.sort((a, b) => (b.importance || 0) - (a.importance || 0));
    }
    // (Nếu sortBy === 'default', giữ nguyên thứ tự thêm vào)

    return sorted;
  }, [tasks, selectedCategory, sortBy, CATEGORIES]); // Thêm CATEGORIES vào dependency array của useMemo

  // *** LỖI CỦA BẠN Ở ĐÂY ***
  // MỚI: Thêm 4 dòng bị thiếu để định nghĩa các cột
  const pending = processedTasks.filter((t) => t.status === "pending");
  const priority = processedTasks.filter((t) => t.status === "priority");
  const inprogress = processedTasks.filter((t) => t.status === "inprogress");
  const completed = processedTasks.filter((t) => t.status === "completed");

  // (Helper components giữ nguyên)
  const CategoryTab = ({ name, onClick, isActive }) => (
    <button 
      onClick={onClick} 
      className={`text-sm px-3 py-1 rounded-full whitespace-nowrap ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
      {name}
    </button>
  );

  const SortButton = ({ name, onClick, isActive }) => (
    <button 
      onClick={onClick} 
      className={`text-sm px-3 py-1 border rounded ${isActive ? 'bg-blue-100 border-blue-600 text-blue-800 font-medium' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
    >
      {name}
    </button>
  );
  // ---

  return (
    <div className="p-6">
      {isModalOpen && (
        <AddTaskModal 
          onAddTask={addTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* (Hàng Tiêu đề và Nút Add giữ nguyên) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
        >
          Thêm Task Mới
        </button>
      </div>

      {/* (Hàng Bộ lọc Category giữ nguyên) */}
      <div className="mb-4 pb-2 overflow-x-auto">
        <div className="flex flex-nowrap gap-2">
          <CategoryTab name="All" onClick={() => setSelectedCategory('All')} isActive={selectedCategory === 'All'} />
          {CATEGORIES.map(c => (
            <CategoryTab 
              key={c.id} 
              name={c.name} 
              onClick={() => setSelectedCategory(c.name)} 
              isActive={selectedCategory === c.name} 
            />
          ))}
        </div>
      </div>

      {/* (Hàng Bộ lọc Sắp xếp giữ nguyên) */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-gray-600">Sắp xếp theo:</span>
        {/* SỬA LỖI: setSortB -> setSortBy */}
        <SortButton name="Mặc định" onClick={() => setSortBy('default')} isActive={sortBy === 'default'} />
        <SortButton name="Khẩn cấp (Deadline)" onClick={() => setSortBy('urgency')} isActive={sortBy === 'urgency'} />
        <SortButton name="Quan trọng" onClick={() => setSortBy('importance')} isActive={sortBy === 'importance'} />
      </div>

      {/* Lưới hiển thị Task */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        
        {/* Cột Pending */}
        <div>
          {/* Dòng này sẽ hết lỗi vì 'pending' đã được định nghĩa */}
          <h3 className="font-medium mb-2">Add to / Pending ({pending.length})</h3>
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3">
            {pending.map((t) => (
              <TaskCard key={t.id} task={t} onMove={moveTask} onComplete={completeTask} onRestore={restoreTask} />
            ))}
          </div>
        </div>
        
        {/* Cột Priority */}
        <div>
          <h3 className="font-medium mb-2">High Priority ({priority.length})</h3>
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3">
            {priority.map((t) => (
              <TaskCard key={t.id} task={t} onMove={moveTask} onComplete={completeTask} onRestore={restoreTask} />
            ))}
          </div>
        </div>
        
        {/* Cột In Progress */}
        <div>
          <h3 className="font-medium mb-2">In Progress ({inprogress.length})</h3>
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3">
            {inprogress.map((t) => (
              <TaskCard key={t.id} task={t} onMove={moveTask} onComplete={completeTask} onRestore={restoreTask} />
            ))}
          </div>
        </div>
        
        {/* Cột Completed */}
        <div>
          <h3 className="font-medium mb-2 flex items-center justify-between">Completed ({completed.length}) <button onClick={() => setShowCompleted((s) => !s)} className="text-xs px-2 py-1 border rounded">{showCompleted ? "Hide" : "Show"}</button></h3>
          <div className={`${showCompleted ? "block" : "hidden"} max-h-[600px] overflow-y-auto pr-2 space-y-3`}>
            {completed.map((t) => (
              <TaskCard key={t.id} task={t} onMove={moveTask} onComplete={completeTask} onRestore={restoreTask} />
            ))}
          </div>
        </div>
      </div>
      
      {/* (Lịch (preview) giữ nguyên) */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="font-medium mb-2">Calendar (preview)</h4>
        <div className="grid grid-cols-7 gap-2 text-sm text-gray-600">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="border rounded p-2 h-20 bg-gray-50">
              <div className="text-xs text-gray-400">{i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}