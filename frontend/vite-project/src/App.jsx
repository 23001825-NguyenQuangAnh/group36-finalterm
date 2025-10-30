import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

// Import các component đã tách
import Header from "./components/Header";
import Overview from "./pages/Overview";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/DashBoard";

const SAMPLE_TASKS = [
  // ... (dữ liệu mẫu không đổi)
  { id: 1, title: "Finish AI model report", status: "pending", durationMins: 90, createdAt: Date.now() - 86400000 },
  { id: 2, title: "Study Math (Tue 7:30)", status: "priority", durationMins: 60, createdAt: Date.now() - 3600000 },
  { id: 3, title: "Implement login flow", status: "inprogress", durationMins: 120, createdAt: Date.now() - 7200000 },
  { id: 4, title: "Submit assignment (Classroom)", status: "completed", durationMins: 45, createdAt: Date.now() - 172800000 },
];

// ... (Component TaskCard và Dashboard đã được XÓA khỏi đây) ...


// Component App chính
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Đặt state đăng nhập mặc định là `false` để hiển thị LandingPage
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem("awm_tasks_v1");
      if (raw) return JSON.parse(raw);
    } catch (e) { }
    return SAMPLE_TASKS;
  });

  useEffect(() => {
    // Chỉ lưu vào localStorage nếu đã đăng nhập (tùy chọn)
    if (isLoggedIn) {
      try {
        localStorage.setItem("awm_tasks_v1", JSON.stringify(tasks));
      } catch (e) { }
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
        {/* Render component Dashboard đã import */}
        {activeTab === "dashboard" && <Dashboard tasks={tasks} setTasks={setTasks} />}
        {activeTab === "calendar" && <CalendarView tasks={tasks} />}
        {activeTab === "settings" && <Settings onClearData={clearData} />}
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">Prototype • AI Work Manager</footer>
    </div>
  );
}

