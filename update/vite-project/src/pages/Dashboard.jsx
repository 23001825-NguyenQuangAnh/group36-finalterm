import React, { useState, useMemo } from "react";
import { CATEGORIES } from "../constants.js";
import AddTaskModal from "../components/AddTaskModal.jsx";
import TaskCard from "../components/TaskCard.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";
import { uid } from "../utils.js";

// === 🧭 HÀM TRỢ GIÚP VỀ NGÀY THÁNG ===
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day + 1);
  return d;
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

// ==========================================================

export default function Dashboard({ tasks, setTasks }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingTask, setEditingTask] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // === 🧩 Các hàm xử lý Task ===
  const addTask = (
    title,
    description,
    categoryId,
    deadline,
    estimatedDuration,
    importance
  ) => {
    const newTask = {
      id: uid(),
      title: title.trim(),
      description: description.trim() || null,
      categoryId,
      status: "pending",
      durationMins: Number(estimatedDuration) || 60,
      deadline: deadline || null,
      importance: Number(importance) || 5,
      createdAt: Date.now(),
    };
    setTasks((s) => [newTask, ...s]);
    setIsModalOpen(false);
  };

  const moveTask = (task, status) =>
    setTasks((s) => s.map((t) => (t.id === task.id ? { ...t, status } : t)));

  const completeTask = (task) =>
    setTasks((s) =>
      s.map((t) => (t.id === task.id ? { ...t, status: "completed" } : t))
    );

  const restoreTask = (task) =>
    setTasks((s) =>
      s.map((t) => (t.id === task.id ? { ...t, status: "pending" } : t))
    );

  const handleUpdateTask = (taskId, updatedData) => {
    setTasks((currentTasks) =>
      currentTasks.map((t) => (t.id === taskId ? { ...t, ...updatedData } : t))
    );
    setEditingTask(null);
  };

  const handleOpenDetails = (task) => setEditingTask(task);
  const handleCloseDetails = () => setEditingTask(null);

  // === 🧮 Xử lý lọc & sắp xếp Task ===
  const processedTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedCategory !== "All") {
      const categoryId = CATEGORIES.find(
        (c) => c.name === selectedCategory
      )?.id;
      if (categoryId)
        filtered = filtered.filter((t) => t.categoryId === categoryId);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });

    return sorted;
  }, [tasks, selectedCategory]);

  const pending = processedTasks.filter((t) => t.status === "pending");
  const priority = processedTasks.filter((t) => t.status === "priority");
  const inprogress = processedTasks.filter((t) => t.status === "inprogress");
  const completed = processedTasks.filter((t) => t.status === "completed");

  // === 📅 Lịch tuần ===
  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const dayStyles = {
    MONDAY: { bg: "bg-red-50", header: "bg-red-200 text-red-800" },
    TUESDAY: { bg: "bg-purple-50", header: "bg-purple-200 text-purple-800" },
    WEDNESDAY: { bg: "bg-blue-50", header: "bg-blue-200 text-blue-800" },
    THURSDAY: { bg: "bg-orange-50", header: "bg-orange-200 text-orange-800" },
    FRIDAY: { bg: "bg-green-50", header: "bg-green-200 text-green-800" },
    SATURDAY: { bg: "bg-indigo-50", header: "bg-indigo-200 text-indigo-800" },
    SUNDAY: { bg: "bg-gray-50", header: "bg-gray-200 text-gray-800" },
  };

  const weekDates = useMemo(() => {
    const start = getStartOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const tasksByDay = useMemo(() => {
    return daysOfWeek.reduce((acc, day, i) => {
      const date = weekDates[i];
      acc[day] = tasks.filter((t) => isSameDay(t.deadline, date));
      return acc;
    }, {});
  }, [tasks, weekDates]);

  // === 🏷️ Category Tab nhỏ ===
  const CategoryTab = ({ name, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`text-sm px-4 py-1.5 rounded-full font-medium transition ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {name}
    </button>
  );

  // === 🧩 Giao diện chính ===
  return (
    <div className="px-8 py-6 bg-gray-50 min-h-screen">
      {/* --- Modal --- */}
      {isModalOpen && (
        <AddTaskModal
          onAddTask={addTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onUpdateTask={handleUpdateTask}
          onClose={handleCloseDetails}
        />
      )}

      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi và quản lý công việc thông minh ✨
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow hover:bg-blue-700 transition"
        >
          + Thêm Task Mới
        </button>
      </div>

      {/* --- Bộ lọc Category --- */}
      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryTab
          name="All"
          onClick={() => setSelectedCategory("All")}
          isActive={selectedCategory === "All"}
        />
        {CATEGORIES.map((c) => (
          <CategoryTab
            key={c.id}
            name={c.name}
            onClick={() => setSelectedCategory(c.name)}
            isActive={selectedCategory === c.name}
          />
        ))}
      </div>

      {/* --- Lưới Task --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <TaskColumn
          icon="🕓"
          title="Add to / Pending"
          count={pending.length}
          tasks={pending}
          moveTask={moveTask}
          completeTask={completeTask}
          restoreTask={restoreTask}
          onOpenDetails={handleOpenDetails}
        />

        <TaskColumn
          icon="⭐"
          title="High Priority"
          count={priority.length}
          tasks={priority}
          moveTask={moveTask}
          completeTask={completeTask}
          restoreTask={restoreTask}
          onOpenDetails={handleOpenDetails}
        />

        <TaskColumn
          icon="⚙️"
          title="In Progress"
          count={inprogress.length}
          tasks={inprogress}
          moveTask={moveTask}
          completeTask={completeTask}
          restoreTask={restoreTask}
          onOpenDetails={handleOpenDetails}
        />

        {/* Completed */}
        <div className="bg-white/80 border border-gray-200 rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
            ✅ Completed ({completed.length})
            <button
              onClick={() => setShowCompleted((s) => !s)}
              className="text-xs px-2 py-1 border rounded hover:bg-gray-100 transition"
            >
              {showCompleted ? "Hide" : "Show"}
            </button>
          </h3>
          <div
            className={`${
              showCompleted ? "block" : "hidden"
            } space-y-3 overflow-y-auto max-h-[600px] pr-1`}
          >
            {completed.length ? (
              completed.map((t) => (
                <TaskCard
                  key={`${t.id}-${t.createdAt}`}
                  task={t}
                  onMove={moveTask}
                  onComplete={completeTask}
                  onRestore={restoreTask}
                  onOpenDetails={handleOpenDetails}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">
                Chưa có task hoàn thành
              </p>
            )}
          </div>
        </div>
      </div>

      {/* --- Lịch Tuần --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          📅 Lịch Tuần Này
        </h3>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
          >
            ← Tuần trước
          </button>
          <span className="font-medium text-gray-700">
            {weekDates[0].toLocaleDateString("vi-VN")} -{" "}
            {weekDates[6].toLocaleDateString("vi-VN")}
          </span>
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
          >
            Tuần sau →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {daysOfWeek.map((day, index) => {
            const date = weekDates[index];
            const dayTasks = tasksByDay[day] || [];
            const style = dayStyles[day];

            return (
              <div
                key={day}
                className={`rounded-xl border ${style.bg} flex flex-col overflow-hidden`}
              >
                <div
                  className={`p-2 text-sm font-bold text-center ${style.header}`}
                >
                  {day}
                  <div className="text-xs font-normal">
                    {date.toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </div>
                </div>
                <div className="p-2 space-y-2 overflow-y-auto max-h-[200px]">
                  {dayTasks.length ? (
                    dayTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleOpenDetails(task)}
                        className="bg-white border-l-4 border-blue-500 p-2 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
                      >
                        <div className="text-sm font-semibold truncate">
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {CATEGORIES.find((c) => c.id === task.categoryId)
                            ?.name || "N/A"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 p-2 text-center italic">
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

// === 🧩 Subcomponent TaskColumn ===
function TaskColumn({
  icon,
  title,
  count,
  tasks,
  moveTask,
  completeTask,
  restoreTask,
  onOpenDetails,
}) {
  return (
    <div className="bg-white/80 border border-gray-200 rounded-2xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span>{icon}</span> {title} ({count})
      </h3>
      <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
        {tasks.length ? (
          tasks.map((t) => (
            <TaskCard
              key={`${t.id}-${t.createdAt}`}
              task={t}
              onMove={moveTask}
              onComplete={completeTask}
              onRestore={restoreTask}
              onOpenDetails={onOpenDetails}
            />
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">Không có task</p>
        )}
      </div>
    </div>
  );
}
