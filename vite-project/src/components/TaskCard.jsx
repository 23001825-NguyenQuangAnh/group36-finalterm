// src/components/TaskCard.jsx
import React from 'react';
import { CATEGORIES } from '../constants.js'; 

export default function TaskCard({ 
  task, 
  onMove, 
  onComplete, 
  onRestore, 
  onOpenDetails 
}) {
  const isInProgress = task.status === "inprogress";
  const isCompleted = task.status === "completed";

  // Lấy tên category từ id
  const category =
      CATEGORIES.find((c) => c.id === task.categoryId)?.name || "Chưa phân loại";
      
  return (
    <div className="bg-white p-3 rounded shadow-sm w-full min-h-[120px]">

      {/* --- Tiêu đề --- */}
      <div className="mb-2">
        <div
          className="font-semibold text-gray-800 text-sm md:text-base truncate"
          title={task.title}
        >
          {task.title}
        </div>
      </div>

      {/* Tiêu đề + deadline */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-1 pb-2">
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

      {/* --- Các nút hành động --- */}
      {!isCompleted && (
        <div className="flex flex-col gap-2">
          {/* Hàng 1 */}
          <div className="flex gap-2">
            {/* Cột Pending + Priority */}
            {task.status !== "inprogress" && (
              <>
                {task.status === "priority" ? (
                  <button
                    onClick={() => onMove(task, "pending")}
                    className="flex-1 text-xs px-2 py-1 border rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    Depriority
                  </button>
                ) : (
                  <button
                    onClick={() => onMove(task, "priority")}
                    className="flex-1 text-xs px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    Priority
                  </button>
                )}

                <button
                  onClick={() => onMove(task, "inprogress")}
                  className="flex-1 text-xs px-2 py-1 border rounded hover:bg-gray-100"
                >
                  Start
                </button>
              </>
            )}

            {/* Cột In Progress */}
            {isInProgress && (
              <>
                <button
                  onClick={() => onMove(task, "priority")}
                  className="flex-1 text-xs px-2 py-1 border rounded hover:bg-gray-100"
                >
                  Priority
                </button>

                <button
                  onClick={() => onOpenDetails(task)}
                  className="flex-1 text-xs px-2 py-1 border rounded bg-white hover:bg-gray-100 text-gray-700"
                >
                  Chi tiết
                </button>
              </>
            )}
          </div>

          {/* Hàng 2 */}
          <div className="flex gap-2">
            {!isInProgress && (
              <button
                onClick={() => onOpenDetails(task)}
                className="flex-1 text-xs px-2 py-1 border rounded bg-white hover:bg-gray-100 text-gray-700"
              >
                Chi tiết
              </button>
            )}

            <button
              onClick={() => onComplete(task)}
              className={`text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 ${
                isInProgress ? "flex-[2]" : "flex-1"
              }`}
            >
              Complete
            </button>
          </div>
        </div>
      )}

      {/* Nếu task completed */}
      {isCompleted && (
        <div className="mt-2">
          <button
            onClick={() => onRestore(task)}
            className="text-xs px-2 py-1 border rounded hover:bg-gray-100 w-full"
          >
            Restore
          </button>
        </div>
      )}
    </div>
  );
}