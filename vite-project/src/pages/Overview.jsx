import React, { useMemo } from "react";

export default function Overview({ tasks = [] }) {
  const stats = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 86400000;

    const tasksThisWeek = tasks.filter((t) => t.createdAt >= weekAgo);
    const totalWeek = tasksThisWeek.length;
    const completedWeek = tasksThisWeek.filter(
      (t) => t.status === "completed"
    ).length;

    const completionRate =
      totalWeek === 0 ? 0 : Math.round((completedWeek / totalWeek) * 100);
    const avgTime =
      tasks.length === 0
        ? 0
        : Math.round(
            tasks.reduce((sum, t) => sum + (t.durationMins || 0), 0) /
              tasks.length
          );

    // Tính task trễ deadline
    const missed = tasks.filter(
      (t) =>
        t.deadline &&
        new Date(t.deadline) < new Date() &&
        t.status !== "completed"
    ).length;

    return { completionRate, avgTime, missed, totalWeek };
  }, [tasks]);

  // Chọn màu dựa theo performance
  const rateColor =
    stats.completionRate >= 80
      ? "text-green-600"
      : stats.completionRate >= 50
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Performance Overview</h2>

      {/* 4 ô thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className={`text-4xl font-bold ${rateColor}`}>
            {stats.completionRate}%
          </div>
          <div className="text-sm text-gray-500">
            Work completed this week ({stats.totalWeek} tasks)
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-blue-600">
            {stats.avgTime}m
          </div>
          <div className="text-sm text-gray-500">Avg. duration per task</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl font-bold text-red-600">{stats.missed}</div>
          <div className="text-sm text-gray-500">Missed deadlines</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-2">Productivity trend</div>
          <div className="h-3 bg-gray-100 rounded relative">
            <div
              className="absolute left-0 top-0 h-3 bg-blue-500 rounded transition-all"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Based on weekly completion rate
          </div>
        </div>
      </div>

      {/* Khu vực gợi ý AI */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="text-sm text-gray-600 font-medium mb-2">
          AI Suggestions
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {stats.completionRate < 50 && (
            <li>
              Try focusing on smaller, quick-win tasks to regain momentum.
            </li>
          )}
          {stats.missed > 0 && (
            <li>
              Consider setting earlier reminders for deadlines to reduce missed
              tasks.
            </li>
          )}
          <li>Split long tasks into 30–60 minute focused sessions.</li>
          <li>Schedule your hardest work blocks in the morning.</li>
        </ul>
      </div>
    </div>
  );
}