// src/pages/CalendarView.jsx
import React from "react";

export default function CalendarView({ tasks }) {
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