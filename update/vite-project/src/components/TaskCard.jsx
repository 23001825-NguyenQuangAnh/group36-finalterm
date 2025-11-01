import React from "react";
import { CATEGORIES } from "../constants.js";

export default function TaskCard({
  task,
  onMove,
  onComplete,
  onRestore,
  onOpenDetails,
}) {
  const isInProgress = task.status === "inprogress";
  const isCompleted = task.status === "completed";

  // Lấy tên category từ id
  const category =
    CATEGORIES.find((c) => c.id === task.categoryId)?.name || "Chưa phân loại";

  return (
    <div
      className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer`}
      onClick={() => !isCompleted && onOpenDetails(task)}
    >
      {/* --- Tiêu đề --- */}
      <div className="mb-2">
        <div
          className="font-semibold text-gray-800 text-sm md:text-base truncate"
          title={task.title}
        >
          {task.title}
        </div>

        {/* --- Category & Deadline --- */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span className="italic">{category}</span>
          {task.deadline && (
            <span className="text-red-600">
              ⏰{" "}
              {new Date(task.deadline + "T00:00:00").toLocaleDateString(
                "vi-VN",
                {
                  day: "2-digit",
                  month: "2-digit",
                }
              )}
            </span>
          )}
        </div>
      </div>

      {/* --- Action Buttons --- */}
      {!isCompleted ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {/* --- Pending & Priority --- */}
          {task.status !== "inprogress" && (
            <>
              {task.status === "priority" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove(task, "pending");
                  }}
                  className="text-xs px-2 py-1 border rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                >
                  Depriority
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove(task, "priority");
                  }}
                  className="text-xs px-2 py-1 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  Priority
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task, "inprogress");
                }}
                className="text-xs px-2 py-1 border rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
              >
                Start
              </button>
            </>
          )}

          {/* --- In Progress --- */}
          {isInProgress && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task, "priority");
                }}
                className="text-xs px-2 py-1 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                Priority
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(task);
                }}
                className="text-xs px-2 py-1 border rounded-lg bg-white hover:bg-gray-100 text-gray-700 transition"
              >
                Chi tiết
              </button>
            </>
          )}

          {/* --- Complete --- */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task);
            }}
            className={`text-xs px-2 py-1 col-span-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition`}
          >
            ✅ Complete
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore(task);
            }}
            className="text-xs px-2 py-1 border rounded-lg hover:bg-gray-100 w-full transition"
          >
            🔁 Restore
          </button>
        </div>
      )}
    </div>
  );
}
