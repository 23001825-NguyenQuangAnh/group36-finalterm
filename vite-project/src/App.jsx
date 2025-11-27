import React, { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Overview from "./pages/Overview";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";

import { useTasks } from "./hooks/useTasks";
import { handleSyncDemo, toggleLogin } from "./utils/auth";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const { tasks, setTasks } = useTasks(isLoggedIn);

  const clearData = () => {
    if (confirm("Clear local demo data?")) {
      localStorage.removeItem("awm_tasks_v1");
      setTasks([]);
    }
  };

  if (!isLoggedIn) {
    // LandingPage 
    if (!showLoginPage) {
      return (
        <>
          <Toaster position="top-right" />
          <LandingPage onLogin={() => setShowLoginPage(true)} />
        </>
      );
    }

    // Khi user bấm đăng nhập → mở LoginPage
    return (
      <>
        <Toaster position="top-right" />
        <LoginPage
          onAuthSuccess={() => {
            toggleLogin(setIsLoggedIn);
            setShowLoginPage(false);
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Toaster */}
      <Toaster position="top-right" />

      {/* Header */}
      <Header
        userName={localStorage.getItem("awm_user_name") || "Người dùng"}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSync={handleSyncDemo}
        isLoggedIn={isLoggedIn}
        onLoginLogout={() => toggleLogin(setIsLoggedIn)}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-6">
        {activeTab === "overview" && <Overview tasks={tasks} />}
        {activeTab === "dashboard" && (
          <Dashboard tasks={tasks} setTasks={setTasks} />
        )}
        {activeTab === "calendar" && <CalendarView tasks={tasks} />}
        {activeTab === "settings" && <Settings onClearData={clearData} />}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6">
        Prototype • AI Work Manager
      </footer>
    </div>
  );
}
