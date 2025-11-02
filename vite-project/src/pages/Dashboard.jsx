import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants.js';
import AddTaskModal from '../components/AddTaskModal.jsx';
import TaskCard from '../components/TaskCard.jsx';
import EditTaskModal from '../components/EditTaskModal.jsx';
import { uid } from '../utils.js';

// === HÀM TRỢ GIÚP NGÀY THÁNG ===
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
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// === DASHBOARD COMPONENT ===
export default function Dashboard({ tasks, setTasks }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingTask, setEditingTask] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // === QUẢN LÝ TASK ===
  const addTask = (title, description, categoryId, deadline, duration, importance) => {
    const newTask = {
      id: uid(),
      title: title.trim(),
      description: description.trim() || null,
      categoryId,
      status: 'pending',
      durationMins: Number(duration) || 60,
      deadline: deadline || null,
      importance: Number(importance) || 5,
      createdAt: Date.now(),
    };
    setTasks((s) => [newTask, ...s]);
    setIsModalOpen(false);
  };

  const updateTask = (id, data) =>
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, ...data } : task)));
  const moveTask = (task, status) => updateTask(task.id, { status });
  const completeTask = (task) => updateTask(task.id, { status: 'completed' });
  const restoreTask = (task) => updateTask(task.id, { status: 'pending' });

  // === MODAL ===
  const openEdit = (task) => setEditingTask(task);
  const closeEdit = () => setEditingTask(null);

  // === LỌC & SẮP XẾP ===
  const processedTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedCategory !== 'All') {
      const categoryId = CATEGORIES.find((c) => c.name === selectedCategory)?.id;
      if (categoryId) filtered = filtered.filter((t) => t.categoryId === categoryId);
    }
    return [...filtered].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [tasks, selectedCategory]);

  const pending = processedTasks.filter((t) => t.status === 'pending');
  const priority = processedTasks.filter((t) => t.status === 'priority');
  const inprogress = processedTasks.filter((t) => t.status === 'inprogress');
  const completed = processedTasks.filter((t) => t.status === 'completed');

  // === LỊCH TUẦN ===
  const daysOfWeek = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
  const colors = [
    'red','purple','blue','orange','green','indigo','gray'
  ];
  const weekDates = useMemo(() => {
    const start = getStartOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [currentDate]);

  const tasksByDay = useMemo(() => {
    const map = {};
    weekDates.forEach((date, i) => {
      const key = daysOfWeek[i];
      map[key] = tasks.filter((t) => isSameDay(t.deadline, date));
    });
    return map;
  }, [tasks, weekDates]);

  // === CATEGORY TAB ===
  const CategoryTab = ({ name, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white shadow'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {name}
    </button>
  );

  // === UI ===
  return (
    <div className="p-6 space-y-6">
      {/* MODALS */}
      {isModalOpen && (
        <AddTaskModal onAddTask={addTask} onClose={() => setIsModalOpen(false)} />
      )}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onUpdateTask={updateTask}
          onClose={closeEdit}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi và quản lý công việc thông minh ✨
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow hover:bg-blue-700"
        >
          Thêm Task
        </button>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <CategoryTab
          name="All"
          active={selectedCategory === 'All'}
          onClick={() => setSelectedCategory('All')}
        />
        {CATEGORIES.map((c) => (
          <CategoryTab
            key={c.id}
            name={c.name}
            active={selectedCategory === c.name}
            onClick={() => setSelectedCategory(c.name)}
          />
        ))}
      </div>

      {/* TASK COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[['Pending', pending], ['Priority', priority], ['In Progress', inprogress], ['Completed', completed]].map(([title, list], i) => (
          <div key={title}>
            <h3 className="font-semibold mb-2 flex justify-between items-center">
              {title} ({list.length})
              {title === 'Completed' && (
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="text-xs px-2 py-1 border rounded"
                >
                  {showCompleted ? 'Hide' : 'Show'}
                </button>
              )}
            </h3>
            <div
              className={`space-y-3 max-h-[600px] overflow-y-auto pr-2 ${
                title === 'Completed' && !showCompleted ? 'hidden' : ''
              }`}
            >
              {list.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onMove={moveTask}
                  onComplete={completeTask}
                  onRestore={restoreTask}
                  onOpenDetails={openEdit}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* WEEKLY VIEW */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          📅 Lịch Tuần Này
        </h3>

        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            &lt; Tuần trước
          </button>
          <span className="font-medium text-gray-700">
            {weekDates[0].toLocaleDateString('vi-VN')} -{' '}
            {weekDates[6].toLocaleDateString('vi-VN')}
          </span>
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Tuần sau &gt;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {daysOfWeek.map((day, i) => {
            const date = weekDates[i];
            const list = tasksByDay[day] || [];
            const color = colors[i];
            return (
              <div
                key={day}
                className={`rounded-lg border border-${color}-300 bg-${color}-50 min-h-[200px] flex flex-col`}
              >
                <div
                  className={`p-2 rounded-t-lg font-bold text-sm text-center bg-${color}-200 text-${color}-800`}
                >
                  <div>{day}</div>
                  <div className="text-xs font-normal">
                    {date.toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </div>
                </div>

                <div className="p-2 space-y-2 overflow-y-auto">
                  {list.length > 0 ? (
                    list.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => openEdit(task)}
                        className="bg-white p-2 rounded shadow border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition"
                      >
                        <div
                          className="text-sm font-semibold truncate"
                          title={task.title}
                        >
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {CATEGORIES.find((c) => c.id === task.categoryId)?.name || 'N/A'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 text-center italic mt-2">
                      Không có task
                    </div>
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
