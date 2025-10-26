import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const SAMPLE_TASKS = [
  { id: 1, title: "Finish AI model report", status: "pending", durationMins: 90, createdAt: Date.now() - 86400000 },
  { id: 2, title: "Study Math (Tue 7:30)", status: "priority", durationMins: 60, createdAt: Date.now() - 3600000 },
  { id: 3, title: "Implement login flow", status: "inprogress", durationMins: 120, createdAt: Date.now() - 7200000 },
  { id: 4, title: "Submit assignment (Classroom)", status: "completed", durationMins: 45, createdAt: Date.now() - 172800000 },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function Header({ userName = "User", activeTab, setActiveTab, onSync }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl font-semibold">AI</div>
        <h1 className="text-xl font-semibold">AI Work Manager</h1>
        <nav className="ml-6 flex gap-2 text-sm text-gray-600">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-2 rounded ${activeTab === "overview" ? "bg-gray-200" : "hover:bg-gray-50"}`}>
            Overview
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-2 rounded ${activeTab === "dashboard" ? "bg-gray-200" : "hover:bg-gray-50"}`}>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-3 py-2 rounded ${activeTab === "calendar" ? "bg-gray-200" : "hover:bg-gray-50"}`}>
            Calendar
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-2 rounded ${activeTab === "settings" ? "bg-gray-200" : "hover:bg-gray-50"}`}>
            Settings
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onSync} className="px-3 py-2 bg-gray-100 rounded">Sync</button>
        <div className="text-sm">{userName}</div>
      </div>
    </header>
  );
}

function Overview({ tasks }) {
  const stats = useMemo(() => {
    const totalWeek = tasks.filter((t) => t.createdAt > Date.now() - 7 * 86400000).length || 0;
    const completedWeek = tasks.filter((t) => t.status === "completed" && t.createdAt > Date.now() - 7 * 86400000).length || 0;
    const completionRate = totalWeek === 0 ? 0 : Math.round((completedWeek / totalWeek) * 100);
    const avgTime = tasks.length === 0 ? 0 : Math.round(tasks.reduce((s, t) => s + (t.durationMins || 0), 0) / tasks.length);
    const missed = tasks.filter((t) => t._missed).length;
    return { completionRate, avgTime, missed };
  }, [tasks]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Performance Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-4xl font-bold">{stats.completionRate}%</div>
          <div className="text-sm text-gray-500">Work completed (this week)</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-2xl font-bold">{stats.avgTime}m</div>
          <div className="text-sm text-gray-500">Avg. time per task</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-2xl font-bold">{stats.missed}</div>
          <div className="text-sm text-gray-500">Missed deadlines</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-gray-500">Productivity</div>
          <div className="h-24 flex items-end justify-center">
            {/* small ascii chart placeholder */}
            <div className="w-full h-2 bg-gray-100 rounded" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <div className="text-sm text-gray-600">AI suggestions</div>
        <ul className="mt-2 list-disc list-inside text-gray-700">
          <li>Try splitting long tasks into 30–60 minute chunks.</li>
          <li>Schedule focused blocks in the morning for deep work.</li>
        </ul>
      </div>
    </div>
  );
}

function TaskCard({ task, onMove, onComplete, onRestore }) {
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

function Dashboard({ tasks, setTasks }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    setTitle("");
    setDuration(60);
  }, []);

  const addTask = () => {
    if (!title.trim()) return;
    const t = { id: uid(), title: title.trim(), status: "pending", durationMins: Number(duration), createdAt: Date.now() };
    setTasks((s) => [t, ...s]);
    setTitle("");
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

function CalendarView({ tasks }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
      <div className="bg-white p-4 rounded shadow-sm">
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

function Settings({ onClearData }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div className="mb-2">Location permissions: <span className="text-sm text-gray-500">(demo)</span></div>
        <div className="mb-2">Sync with Google Calendar / Classroom: <span className="text-sm text-gray-500">(requires backend & OAuth)</span></div>
      </div>
      <button onClick={onClearData} className="px-4 py-2 bg-red-600 text-white rounded">Clear demo data</button>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem("awm_tasks_v1");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return SAMPLE_TASKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("awm_tasks_v1", JSON.stringify(tasks));
    } catch (e) {}
  }, [tasks]);

  const handleSync = () => {
    // demo sync: just show an alert. In real app, open OAuth flow & call backend.
    alert("Sync (demo): here you would connect Google Calendar / Classroom / Gmail");
  };

  const clearData = () => {
    if (confirm("Clear local demo data?")) {
      localStorage.removeItem("awm_tasks_v1");
      setTasks([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header userName="Người dùng" activeTab={activeTab} setActiveTab={setActiveTab} onSync={handleSync} />

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