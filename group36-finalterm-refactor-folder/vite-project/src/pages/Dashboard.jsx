// Dashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import AddTaskModal from "../components/AddTaskModal.jsx";
import TaskCard from "../components/TaskCard.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";
import toast from "react-hot-toast";
import ChatAssistant from "../components/ChatAssistant.jsx";

// ⭐ BACKEND API
import {
  getAllTasks,
  createTask,
  updateTask as updateTaskApi,
  updateTaskStatus,
  updateTaskPriority,
  deleteTask,
} from "../api/taskApi.js";

import { getAllCategories } from "../api/categoryApi.js";

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

// 🟩 Tailwind color map cho lịch tuần
const colorMap = {
  red: {
    border: "border-red-300",
    bg: "bg-red-50",
    headerBg: "bg-red-200",
    headerText: "text-red-800",
  },
  purple: {
    border: "border-purple-300",
    bg: "bg-purple-50",
    headerBg: "bg-purple-200",
    headerText: "text-purple-800",
  },
  blue: {
    border: "border-blue-300",
    bg: "bg-blue-50",
    headerBg: "bg-blue-200",
    headerText: "text-blue-800",
  },
  orange: {
    border: "border-orange-300",
    bg: "bg-orange-50",
    headerBg: "bg-orange-200",
    headerText: "text-orange-800",
  },
  green: {
    border: "border-green-300",
    bg: "bg-green-50",
    headerBg: "bg-green-200",
    headerText: "text-green-800",
  },
  indigo: {
    border: "border-indigo-300",
    bg: "bg-indigo-50",
    headerBg: "bg-indigo-200",
    headerText: "text-indigo-800",
  },
  yellow: {
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    headerBg: "bg-yellow-200",
    headerText: "text-yellow-800",
  },
};

export default function Dashboard() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id || null;

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingTask, setEditingTask] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showChat, setShowChat] = useState(false);

  // ===========================
  // LOAD DATA
  // ===========================
  const loadTasks = async () => {
    try {
      const res = await getAllTasks();
      setTasks(res.data.result || []);
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải danh sách task!");
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data.result || []);
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải danh sách category!");
    }
  };

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [userId]);

  // ===========================
  // ACTIONS
  // ===========================
  const addTask = async (taskData) => {
    try {
      await createTask(taskData);
      toast.success("Thêm task thành công!");
      loadTasks();
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi thêm task!");
    }
  };

  const updateTask = async (id, data) => {
    try {
      await updateTaskApi(id, data);
      toast.success("Cập nhật task thành công!");
      loadTasks();
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi cập nhật task!");
    }
  };

  const deleteTaskHandler = async (id) => {
    try {
      await deleteTask(id);
      toast.success("Đã xóa task!");
      loadTasks();
    } catch (e) {
      console.error(e);
      toast.error("Xóa task thất bại!");
    }
  };

  const moveTask = async (task, status) => {
    try {
      await updateTaskStatus(task.id, status);
      loadTasks();
    } catch (e) {
      console.error(e);
      toast.error("Không thể cập nhật trạng thái task!");
    }
  };

  const completeTask = async (task) => {
    try {
      await updateTaskStatus(task.id, "COMPLETED");
      loadTasks();
    } catch (e) {
      console.error(e);
      toast.error("Không thể hoàn thành task!");
    }
  };

  const restoreTask = async (task) => {
    try {
      await updateTaskStatus(task.id, "PENDING");
      loadTasks();
    } catch (e) {
      console.error(e);
      toast.error("Không thể khôi phục task!");
    }
  };

  const changePriority = async (task, level) => {
    try {
      await updateTaskPriority(task.id, level);
      loadTasks();
    } catch (e) {
      console.error(e);
      toast.error("Không thể đổi mức ưu tiên!");
    }
  };

  const openEdit = (task) => setEditingTask(task);
  const closeEdit = () => setEditingTask(null);

  // ===========================
  // FILTER & SORT
  // ===========================
  const processedTasks = useMemo(() => {
    let filtered = tasks;

    if (selectedCategory !== "All") {
      const categoryId = categories.find(
        (c) => c.name === selectedCategory
      )?.id;
      if (categoryId) {
        filtered = filtered.filter((t) => t.categoryId === categoryId);
      }
    }

    return [...filtered].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [tasks, selectedCategory, categories]);

  const pending = processedTasks.filter(
    (t) => t.status === "PENDING" && t.priorityLevel === "NORMAL"
  );
  const priority = processedTasks.filter(
    (t) => t.priorityLevel === "HIGH" && t.status !== "COMPLETED"
  );
  const inprogress = processedTasks.filter((t) => t.status === "IN_PROGRESS");
  const completed = processedTasks.filter((t) => t.status === "COMPLETED");

  // ===========================
  // WEEK DATA
  // ===========================
  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const colors = [
    "red",
    "purple",
    "blue",
    "orange",
    "green",
    "indigo",
    "yellow",
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

  // ===========================
  // CATEGORY TAB
  // ===========================
  const CategoryTab = ({ name, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition whitespace-nowrap cursor-pointer ${
        active
          ? "bg-blue-600 text-white shadow transform scale-[1.02]"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {name}
    </button>
  );

  // ===========================
  // UI
  // ===========================
  return (
    <div className="p-6 space-y-6">
      {/* MODALS */}
      {isModalOpen && (
        <AddTaskModal
          onAddTask={addTask}
          onClose={() => setIsModalOpen(false)}
          categories={categories}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onUpdateTask={updateTask}
          onClose={closeEdit}
          categories={categories}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-yellow-500 mt-1">
            Theo dõi và quản lý công việc thông minh ✨
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow hover:bg-blue-700 cursor-pointer"
        >
          Thêm Task
        </button>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <CategoryTab
          name="All"
          active={selectedCategory === "All"}
          onClick={() => setSelectedCategory("All")}
        />

        {categories.map((c) => (
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
        {[
          ["Pending", pending],
          ["Priority", priority],
          ["In Progress", inprogress],
          ["Completed", completed],
        ].map(([title, list]) => (
          <div key={title}>
            <h3 className="font-semibold mb-2 flex justify-between items-center">
              {title} ({list.length})
              {title === "Completed" && (
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="text-xs px-2 py-1 border rounded cursor-pointer hover:bg-gray-100"
                >
                  {showCompleted ? "Hide" : "Show"}
                </button>
              )}
            </h3>

            <div
              className={`space-y-3 max-h-[600px] overflow-y-auto pr-2 ${
                title === "Completed" && !showCompleted ? "hidden" : ""
              }`}
            >
              {list.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  categories={categories}
                  onMove={moveTask}
                  onComplete={completeTask}
                  onRestore={restoreTask}
                  onOpenDetails={openEdit}
                  onChangePriority={changePriority}
                  onDelete={deleteTaskHandler}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* WEEKLY CALENDAR */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
            className="px-3 py-1 bg-yellow-200 text-gray-700 rounded hover:bg-yellow-300 text-sm cursor-pointer"
          >
            &lt; Tuần trước
          </button>

          <span className="font-medium text-gray-700">
            {weekDates[0].toLocaleDateString("vi-VN")} -{" "}
            {weekDates[6].toLocaleDateString("vi-VN")}
          </span>

          <button
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
            className="px-3 py-1 bg-yellow-200 text-gray-700 rounded hover:bg-yellow-300 text-sm cursor-pointer"
          >
            Tuần sau &gt;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
          {daysOfWeek.map((day, i) => {
            const date = weekDates[i];
            const list = tasksByDay[day] || [];
            const color = colors[i];
            const c = colorMap[color];

            return (
              <div
                key={day}
                className={`rounded-lg border ${c.border} ${c.bg} min-h-[200px] flex flex-col`}
              >
                <div
                  className={`p-2 rounded-t-lg font-bold text-sm text-center ${c.headerBg} ${c.headerText}`}
                >
                  <div>{day}</div>
                  <div className="text-xs font-normal">
                    {date.toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
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
                        <div className="text-xs text-yellow-500">
                          {categories.find((c) => c.id === task.categoryId)
                            ?.name || "N/A"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-yellow-400 text-center italic mt-2">
                      Không có task
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING CHAT BUTTON */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 cursor-pointer"
      >
        💬
      </button>

      {/* CHAT POPUP */}
      {showChat && (
        <div className="fixed bottom-24 right-8 w-96 bg-white shadow-xl rounded-xl border p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Assistant AI 🤖</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-600 hover:text-gray-900 text-xl cursor-pointer"
            >
              ✖
            </button>
          </div>

          <ChatAssistant onTaskCreated={loadTasks} />
        </div>
      )}
    </div>
  );
}
