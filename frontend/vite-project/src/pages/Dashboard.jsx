import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants.js';
import AddTaskModal from '../components/AddTaskModal.jsx'; 
import TaskCard from '../components/TaskCard.jsx';
import EditTaskModal from '../components/EditTaskModal.jsx';
import { uid } from '../utils.js'; 

// === HÀM TRỢ GIÚP VỀ NGÀY THÁNG (GIỮ NGUYÊN) ===
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setHours(0, 0, 0, 0); 
  return new Date(d.setDate(diff));
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};
// ==========================================================


// --- Component Dashboard (Cập nhật) ---
export default function Dashboard({ tasks, setTasks }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  // const [sortBy, setSortBy] = useState("default"); // <-- ĐÃ XÓA
  const [editingTask, setEditingTask] = useState(null); 
  const [currentDate, setCurrentDate] = useState(new Date());

  // (addTask, moveTask, completeTask, restoreTask giữ nguyên)
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
  // (handleUpdateTask, handleOpenDetails, handleCloseDetails giữ nguyên)
  const handleUpdateTask = (taskId, updatedData) => {
    setTasks((currentTasks) =>
      currentTasks.map((t) =>
        t.id === taskId
          ? { ...t, ...updatedData } 
          : t
      )
    );
    setEditingTask(null); 
  };
  
  const handleOpenDetails = (task) => {
    setEditingTask(task);
  };

  const handleCloseDetails = () => {
    setEditingTask(null);
  };
  
  // (processedTasks... CẬP NHẬT)
  const processedTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedCategory !== 'All') {
      const categoryId = CATEGORIES.find(c => c.name === selectedCategory)?.id;
      if (categoryId) {
        filtered = filtered.filter(t => t.categoryId === categoryId);
      }
    }

    let sorted = [...filtered]; 
    
    // CẬP NHẬT: Luôn sắp xếp theo deadline
    sorted.sort((a, b) => {
      if (!a.deadline) return 1; // Không có deadline xuống cuối
      if (!b.deadline) return -1; // Không có deadline xuống cuối
      return new Date(a.deadline) - new Date(b.deadline); // Deadline sớm nhất lên đầu
    });

    return sorted;
  }, [tasks, selectedCategory, CATEGORIES]); // <-- ĐÃ XÓA 'sortBy'

  const pending = processedTasks.filter((t) => t.status === "pending");
  const priority = processedTasks.filter((t) => t.status === "priority");
  const inprogress = processedTasks.filter((t) => t.status === "inprogress");
  const completed = processedTasks.filter((t) => t.status === "completed");

  // --- (Lịch tuần giữ nguyên) ---
  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const dayStyles = {
    MONDAY:   { bg: 'bg-red-50',     border: 'border-red-300',     header: 'bg-red-200 text-red-800' },
    TUESDAY:  { bg: 'bg-purple-50',  border: 'border-purple-300', header: 'bg-purple-200 text-purple-800' },
    WEDNESDAY:{ bg: 'bg-blue-50',    border: 'border-blue-300',   header: 'bg-blue-200 text-blue-800' },
    THURSDAY: { bg: 'bg-orange-50',  border: 'border-orange-300', header: 'bg-orange-200 text-orange-800' },
    FRIDAY:   { bg: 'bg-green-50',   border: 'border-green-300',  header: 'bg-green-200 text-green-800' },
    SATURDAY: { bg: 'bg-indigo-50',  border: 'border-indigo-300', header: 'bg-indigo-200 text-indigo-800' },
    SUNDAY:   { bg: 'bg-gray-50',    border: 'border-gray-300',   header: 'bg-gray-200 text-gray-800' },
  };

  const weekDates = useMemo(() => {
    const start = getStartOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [currentDate]);

  const tasksByDay = useMemo(() => {
    const dailyTasks = {};
    weekDates.forEach((date, index) => {
      const dayKey = daysOfWeek[index];
      dailyTasks[dayKey] = tasks.filter(task => isSameDay(task.deadline, date));
    });
    return dailyTasks;
  }, [tasks, weekDates]);
  // ---

  // (CategoryTab giữ nguyên)
  const CategoryTab = ({ name, onClick, isActive }) => (
    <button 
      onClick={onClick} 
      className={`text-sm px-3 py-1 rounded-full whitespace-nowrap ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
>
      {name}
    </button>
  );

  // const SortButton = ... // <-- ĐÃ XÓA
  // ---

  return (
    <div className="p-6">
      {/* Modal Thêm Task (giữ nguyên) */}
      {isModalOpen && (
        <AddTaskModal 
          onAddTask={addTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      
      {/* Modal Chỉnh Sửa Task (giữ nguyên) */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onUpdateTask={handleUpdateTask}
          onClose={handleCloseDetails}
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

      {/* (Hàng Bộ lọc Sắp xếp) <-- ĐÃ XÓA */}
      {/*       <div className="flex items-center gap-2 mb-4">
        ...
      </div>
      */}

      {/* Lưới hiển thị Task (giữ nguyên) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        
        {/* Cột Pending */}
        <div>
          <h3 className="font-medium mb-2">Add to / Pending ({pending.length})</h3>
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3">
            {pending.map((t) => (
              <TaskCard 
                key={t.id} 
                task={t} 
                onMove={moveTask} 
                onComplete={completeTask} 
                onRestore={restoreTask} 
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        </div>
        
        {/* Cột Priority */}
        <div>
          <h3 className="font-medium mb-2">High Priority ({priority.length})</h3>
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3">
            {priority.map((t) => (
              <TaskCard 
                key={t.id} 
                task={t} 
                onMove={moveTask} 
                onComplete={completeTask} 
                onRestore={restoreTask} 
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        </div>
        
        {/* Cột In Progress */}
        <div>
          <h3 className="font-medium mb-2">In Progress ({inprogress.length})</h3>
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3">
            {inprogress.map((t) => (
              <TaskCard 
                key={t.id} 
                task={t} 
                onMove={moveTask} 
                onComplete={completeTask} 
                onRestore={restoreTask} 
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        </div>
        
        {/* Cột Completed */}
        <div>
          <h3 className="font-medium mb-2 flex items-center justify-between">Completed ({completed.length}) <button onClick={() => setShowCompleted((s) => !s)} className="text-xs px-2 py-1 border rounded">{showCompleted ? "Hide" : "Show"}</button></h3>
          <div className={`${showCompleted ? "block" : "hidden"} max-h-[600px] overflow-y-auto pr-2 space-y-3`}>
            {completed.map((t) => (
              <TaskCard 
                key={t.id} 
                task={t} 
                onMove={moveTask} 
                onComplete={completeTask} 
                onRestore={restoreTask} 
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* (Lịch Tuần giữ nguyên) */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Lịch Tuần Này</h3>
        
        <div className="flex justify-between items-center mb-3">
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, -7))} 
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            &lt; Tuần trước
          </button>
          <span className="font-medium text-gray-700">
            {weekDates[0].toLocaleDateString('vi-VN')} - {weekDates[6].toLocaleDateString('vi-VN')}
          </span>
          <button 
            onClick={() => setCurrentDate(addDays(currentDate, 7))} 
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Tuần sau &gt;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {daysOfWeek.map((dayName, index) => {
            const date = weekDates[index];
            const dayTasks = tasksByDay[dayName] || [];
            const style = dayStyles[dayName];

            return (
              <div key={dayName} className={`rounded-lg border ${style.bg} ${style.border} min-h-[200px] flex flex-col`}>
                <div className={`p-2 rounded-t-lg font-bold text-sm text-center ${style.header}`}>
                  <div>{dayName}</div>
                  <div className="text-xs font-normal">{date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                </div>
                
                <div className="p-2 space-y-2 overflow-y-auto">
                  {dayTasks.length > 0 ? (
                    dayTasks.map(task => (
                      <div 
                        key={task.id} 
                        onClick={() => handleOpenDetails(task)} 
                        className="bg-white p-2 rounded shadow border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="text-sm font-semibold truncate" title={task.title}>{task.title}</div>
                        <div className="text-xs text-gray-500">{CATEGORIES.find(c => c.id === task.categoryId)?.name || 'N/A'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 p-2 text-center italic mt-2">Không có task</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}