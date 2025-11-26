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
      <h2 className="text-2xl font-semibold mb-3">Settings</h2>

      {/* Integration Section */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-5">
        <h3 className="text-lg font-medium mb-3 text-gray-800">Integration</h3>

        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex flex-col">
            <span className="font-medium">Location permissions</span>
            <span className="text-gray-500">(demo only)</span>
          </li>

          <li className="flex flex-col">
            <span className="font-medium">
              Sync with Google Calendar / Classroom
            </span>
            <span className="text-gray-500">
              (requires backend & OAuth setup)
            </span>
          </li>
        </ul>
      </div>

      {/* Data Management */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
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
