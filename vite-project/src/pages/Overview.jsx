// src/pages/Overview.jsx
import React, { useMemo } from "react";

export default function Overview({ tasks }) {
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