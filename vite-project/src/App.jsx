import React, { useState } from "react";
import "./App.css";
import "./styles/neural-theme.css"; // 🎨 import theme
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import Overview from "./pages/Overview";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

import { useTasks } from "./hooks/useTasks";
import { handleSyncDemo, toggleLogin } from "./utils/auth";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { tasks, setTasks } = useTasks(isLoggedIn);
  const navigate = useNavigate();

  const clearData = () => {
    if (confirm("Clear local demo data?")) {
      localStorage.removeItem("awm_tasks_v1");
      setTasks([]);
    }
  };

  // Sau khi login thành công
  const handleLoginSuccess = () => {
    toggleLogin(setIsLoggedIn);
    navigate("/app");
  };

  return (
    <div className="neural-app text-gray-100 min-h-screen">
      <Routes>
        {/* === LANDING PAGE === */}
        <Route path="/" element={<LandingPage />} />

        {/* === LOGIN PAGE === */}
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* === MAIN APP === */}
        <Route
          path="/app"
          element={
            isLoggedIn ? (
              <>
                <Header
                  userName="Người dùng"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onSync={handleSyncDemo}
                  isLoggedIn={isLoggedIn}
                  onLoginLogout={() => toggleLogin(setIsLoggedIn)}
                />

                <main className="max-w-6xl mx-auto py-6 space-y-6">
                  {activeTab === "overview" && (
                    <div className="neural-card hover-glow">
                      <Overview tasks={tasks} />
                    </div>
                  )}
                  {activeTab === "dashboard" && (
                    <div className="neural-card hover-glow">
                      <Dashboard tasks={tasks} setTasks={setTasks} />
                    </div>
                  )}
                  {activeTab === "calendar" && (
                    <div className="neural-card hover-glow">
                      <CalendarView tasks={tasks} />
                    </div>
                  )}
                  {activeTab === "settings" && (
                    <div className="neural-card hover-glow">
                      <Settings onClearData={clearData} />
                    </div>
                  )}
                </main>

                <footer className="text-center text-xs text-subtle py-6">
                  Prototype • AI Work Manager
                </footer>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Mặc định */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
