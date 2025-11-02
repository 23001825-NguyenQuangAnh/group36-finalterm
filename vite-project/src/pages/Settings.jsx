import React from "react";

export default function Settings() {
  const clearData = () => {
    if (confirm("Clear all local demo data?")) {
      localStorage.removeItem("awm_tasks_v1");
      alert("✅ Demo data cleared successfully!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      {/* Khu vực cấu hình */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
        <h3 className="text-lg font-medium mb-3 text-gray-800">Integration</h3>
        <div className="mb-2">
          <span className="font-medium text-gray-700">
            Location permissions:
          </span>{" "}
          <span className="text-sm text-gray-500">(demo only)</span>
        </div>
        <div className="mb-2">
          <span className="font-medium text-gray-700">
            Sync with Google Calendar / Classroom:
          </span>{" "}
          <span className="text-sm text-gray-500">
            (requires backend & OAuth setup)
          </span>
        </div>
      </div>

      {/* Khu vực thao tác dữ liệu */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-3 text-gray-800">
          Data Management
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Clear all stored demo tasks and reset the local environment.
        </p>
        <button
          onClick={clearData}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Clear demo data
        </button>
      </div>
    </div>
  );
}