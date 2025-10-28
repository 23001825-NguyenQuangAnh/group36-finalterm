// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

// Import các component đã tách
import Header from "./components/Header";
import Overview from "./pages/Overview";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import { uid } from "./utils"; // Import hàm uid

// Import trang Landing Page mới
import LandingPage from "./pages/LandingPage";

const SAMPLE_TASKS = [
  // ... (dữ liệu mẫu không đổi)
  { id: 1, title: "Finish AI model report", status: "pending", durationMins: 90, createdAt: Date.now() - 86400000 },
  { id: 2, title: "Study Math (Tue 7:30)", status: "priority", durationMins: 60, createdAt: Date.now() - 3600000 },
  { id: 3, title: "Implement login flow", status: "inprogress", durationMins: 120, createdAt: Date.now() - 7200000 },
  { id: 4, title: "Submit assignment (Classroom)", status: "completed", durationMins: 45, createdAt: Date.now() - 172800000 },
];

// ... (Component TaskCard và Dashboard giữ nguyên, không cần thay đổi) ...

// Component TaskCard (giữ lại trong App.jsx theo yêu cầu)
function TaskCard({ task, onMove, onComplete, onRestore }) {
  // ... (code không đổi)
  return (
    <div className="bg-white p-3 rounded shadow-sm mb-3">
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="font-medium">{task.title}</div>
          <div className="text-xs text-gray-500">{task.durationMins} mins</div>
        </div>
        <div className="flex flex-col gap-2">
          {task.status !== "completed" && (
            <>
              <button onClick={() => onMove(task, "priority")} className="text-xs px-2 py-1 border rounded">To Priority</button>
              <button onClick={() => onMove(task, "inprogress")} className="text-xs px-2 py-1 border rounded">Start</button>
              <button onClick={() => onComplete(task)} className="text-xs px-2 py-1 bg-green-50 rounded">Complete</button>
            </>
          )}
          {task.status === "completed" && (
            <button onClick={() => onRestore(task)} className="text-xs px-2 py-1 border rounded">Restore</button>
          )}
        </div>
      </div>
    </div>
  );
}

// Component Dashboard (giữ lại trong App.jsx theo yêu cầu)
function Dashboard({ tasks, setTasks }) {
  // ... (code không đổi)
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [showCompleted, setShowCompleted] = useState(false);

  const addTask = () => {
    if (!title.trim()) return;
    const t = { id: uid(), title: title.trim(), status: "pending", durationMins: Number(duration), createdAt: Date.now() };
    setTasks((s) => [t, ...s]);
    setTitle("");
    setDuration(60); // Reset duration sau khi thêm
  };

  const moveTask = (task, status) => {
    setTasks((s) => s.map((t) => (t.id === task.id ? { ...t, status } : t)));
  };

  const completeTask = (task) => {
    setTasks((s) => s.map((t) => (t.id === task.id ? { ...t, status: "completed" } : t)));
  };

  const restoreTask = (task) => {
    setTasks((s) => s.map((t) => (t.id === task.id ? { ...t, status: "pending" } : t)));
  };

  const pending = tasks.filter((t) => t.status === "pending");
  const priority = tasks.filter((t) => t.status === "priority");
  const inprogress = tasks.filter((t) => t.status === "inprogress");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <div className="p-6">
      {/* ... (toàn bộ code JSX của Dashboard giữ nguyên) ... */}
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="mb-4 flex gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task title" className="px-3 py-2 border rounded w-1/2" />
        <input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" className="px-3 py-2 border rounded w-32" />
        <button onClick={addTask} className="px-4 py-2 bg-blue-600 text-white rounded">Add Task</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <h3 className="font-medium mb-2">Add to / Pending</h3>
          <div>
            {pending.map((t) => (
              <TaskCard key={t.id} task={t} onMove={moveTask} onComplete={completeTask} onRestore={restoreTask} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">High Priority</h3>
          <div>
            {priority.map((t) => (
              <TaskCard key={t.id} task={t} onMove={moveTask} onComplete={completeTask} onRestore={restoreTask} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">In Progress</h3>
          <div>
            {inprogress.map((t) => (
              <TaskCard key={t.id} task={t} onMove={moveTask} onComplete={completeTask} onRestore={restoreTask} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2 flex items-center justify-between">Completed <button onClick={() => setShowCompleted((s) => !s)} className="text-xs px-2 py-1 border rounded">{showCompleted ? "Hide" : "Show"}</button></h3>
          <div className={`${showCompleted ? "block" : "hidden"}`}>
            {completed.map((t) => (
              <TaskCard key={t.id} task={t} onMove={moveTask} onComplete={completeTask} onRestore={restoreTask} />
            ))}
          </div>
        </div>
      </div>
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


// Component App chính
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); 
  
  // Đặt state đăng nhập mặc định là `false` để hiển thị LandingPage
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem("awm_tasks_v1");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return SAMPLE_TASKS;
  });

  useEffect(() => {
    // Chỉ lưu vào localStorage nếu đã đăng nhập (tùy chọn)
    if (isLoggedIn) {
      try {
        localStorage.setItem("awm_tasks_v1", JSON.stringify(tasks));
      } catch (e) {}
    }
  }, [tasks, isLoggedIn]);

  const handleSync = () => {
    alert("Sync (demo): here you would connect Google Calendar / Classroom / Gmail");
  };

  const clearData = () => {
    if (confirm("Clear local demo data?")) {
      localStorage.removeItem("awm_tasks_v1");
      setTasks([]);
    }
  };

  // Hàm xử lý đăng nhập/đăng xuất (demo)
  const handleLoginLogout = () => {
    setIsLoggedIn((s) => !s); // Đảo ngược trạng thái đăng nhập
    // Không cần alert nữa, việc chuyển trang đã đủ rõ ràng
  };


  // ***** LOGIC RENDER CHÍNH *****
  
  // Nếu CHƯA đăng nhập, hiển thị LandingPage
  // Truyền hàm `handleLoginLogout` vào prop `onLogin`
  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLoginLogout} />;
  }

  // Nếu ĐÃ đăng nhập, hiển thị ứng dụng chính
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header
        userName="Người dùng"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSync={handleSync}
        isLoggedIn={isLoggedIn}
        onLoginLogout={handleLoginLogout}
      />

      <main className="max-w-6xl mx-auto py-6">
        {activeTab === "overview" && <Overview tasks={tasks} />}
        {activeTab === "dashboard" && <Dashboard tasks={tasks} setTasks={setTasks} />}
        {activeTab === "calendar" && <CalendarView tasks={tasks} />}
        {activeTab === "settings" && <Settings onClearData={clearData} />}
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">Prototype • AI Work Manager</footer>
    </div>
  );
}