import React, { useEffect, useState } from "react";
import {
  getPerformanceOverview,
  getPerformanceCharts,
} from "../api/performanceApi";

import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Overview() {
  const [stats, setStats] = useState({
    completionRate: 0,
    avgTime: 0,
    missed: 0,
  });

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const overviewRes = await getPerformanceOverview();
      const ov = overviewRes.data.result;

      setStats({
        completionRate: Math.round(ov.completionRate),
        avgTime: Math.round(ov.avgDuration),
        missed: ov.missedDeadlines,
      });

      const chartsRes = await getPerformanceCharts();
      setChartData(chartsRes.data.result);
    } catch (err) {
      console.error("❌ LOAD FAILED", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !chartData) {
    return <div className="p-6 text-gray-500 italic">Loading charts...</div>;
  }

  // === Chart Data ===
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Completed Tasks",
        data: chartData.dailyCompleted,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const statusData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [
          chartData.statusCounts.completed,
          chartData.statusCounts.inProgress,
          chartData.statusCounts.pending,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Completion Rate (%)",
        data: chartData.weeklyCompletionRate,
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Performance Overview</h2>

      {/* 4 stats box */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-4xl font-bold text-green-600">
            {stats.completionRate}%
          </div>
          <div className="text-sm text-gray-500">Work completed this week</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-3xl font-bold text-blue-600">
            {stats.avgTime}m
          </div>
          <div className="text-sm text-gray-500">Avg. duration per task</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-3xl font-bold text-red-600">{stats.missed}</div>
          <div className="text-sm text-gray-500">Missed deadlines</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
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

      {/* CHARTS FIRST */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Visual Analytics</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <Bar data={weeklyData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <Doughnut data={statusData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <Line data={lineData} />
        </div>
      </div>

      {/* AI Suggestions moved DOWN */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mt-6">
        <div className="text-sm text-gray-600 font-medium mb-2">
          AI Suggestions
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {stats.completionRate < 50 && (
            <li>Try focusing on small tasks to regain momentum.</li>
          )}
          {stats.missed > 0 && (
            <li>Set earlier reminders to avoid missing deadlines.</li>
          )}
          <li>Work in focused 30–60 minute blocks.</li>
          <li>Handle your hardest tasks in the morning.</li>
        </ul>
      </div>
    </div>
  );
}
