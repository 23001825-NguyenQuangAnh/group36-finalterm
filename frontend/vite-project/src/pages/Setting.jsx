// src/pages/Settings.jsx
import React from "react";

export default function Settings({ onClearData }) {
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