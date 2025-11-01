import React, { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Overview from "./pages/Overview";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

import { useTasks } from "./hooks/useTasks";
import { handleSyncDemo, toggleLogin } from "./utils/auth";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { tasks, setTasks } = useTasks(isLoggedIn);

  if (!isLoggedIn)
    return <LandingPage onLogin={() => toggleLogin(setIsLoggedIn)} />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header
        userName="Người dùng"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSync={handleSyncDemo}
        isLoggedIn={isLoggedIn}
        onLoginLogout={() => toggleLogin(setIsLoggedIn)}
      />

      <main className="max-w-6xl mx-auto py-6">
        {activeTab === "overview" && <Overview tasks={tasks} />}
        {activeTab === "dashboard" && (
          <Dashboard tasks={tasks} setTasks={setTasks} />
        )}
        {activeTab === "calendar" && <CalendarView tasks={tasks} />}
        {activeTab === "settings" && <Settings />}
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">
        Prototype • AI Work Manager
      </footer>
    </div>
  );
}
