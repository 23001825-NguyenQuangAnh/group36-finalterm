// src/components/TaskCard.jsx
import React from "react";

export default function TaskCard({
  task,
  categories,
  onMove,
  onComplete,
  onRestore,
  onOpenDetails,
  onChangePriority,
  onDelete,
}) {
  const status = task.status;
  const priority = task.priorityLevel;

  const isPending = status === "PENDING";
  const isInProgress = status === "IN_PROGRESS";
  const isCompleted = status === "COMPLETED";

  const category =
    categories?.find((c) => c.id === task.categoryId)?.name || "Chưa phân loại";

  // Format deadline
  const formatDeadline = (d) => {
    if (!d) return null;
    const date = new Date(d);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = () => {
    if (window.confirm("Bạn chắc chắn muốn xoá task này?")) {
      onDelete(task.id);
    }
  };

  return (
    <div className="bg-white p-3 rounded shadow-sm w-full min-h-[120px]">
      {/* TITLE */}
      <div className="mb-2 font-semibold text-gray-800 text-sm md:text-base truncate">
        {task.title}
      </div>

      {/* CATEGORY + DEADLINE */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-1 pb-2">
        <span className="italic truncate">{category}</span>

        {task.deadline && (
          <span className="text-red-600">
            ⏰ {formatDeadline(task.deadline)}
          </span>
        )}
      </div>

      {/* ACTIONS */}
      {!isCompleted && (
        <div className="flex flex-col gap-2">
          {/* ROW 1 */}
          <div className="flex gap-2">
            {/* PRIORITY BUTTON */}
            {priority === "HIGH" ? (
              <button
                onClick={() => onChangePriority(task, "NORMAL")}
                className="flex-1 text-xs px-2 py-1 border rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer"
              >
                Depriority
              </button>
            ) : (
              <button
                onClick={() => onChangePriority(task, "HIGH")}
                className="flex-1 text-xs px-2 py-1 border rounded hover:bg-gray-100 cursor-pointer"
              >
                Priority
              </button>
            )}

            {/* START BUTTON */}
            {isPending && (
              <button
                onClick={() => onMove(task, "IN_PROGRESS")}
                className="flex-1 text-xs px-2 py-1 border rounded hover:bg-gray-100 cursor-pointer"
              >
                Start
              </button>
            )}

            {/* DETAIL BUTTON */}
            {isInProgress && (
              <button
                onClick={() => onOpenDetails(task)}
                className="flex-1 text-xs px-2 py-1 border rounded bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                Chi tiết
              </button>
            )}
          </div>

          {/* ROW 2 */}
          <div className="flex gap-2">
            {!isInProgress && (
              <button
                onClick={() => onOpenDetails(task)}
                className="flex-1 text-xs px-2 py-1 border rounded bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                Chi tiết
              </button>
            )}

            <button
              onClick={() => onComplete(task)}
              className={`text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 cursor-pointer ${
                isInProgress ? "flex-[2]" : "flex-1"
              }`}
            >
              Complete
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED STATE */}
      {isCompleted && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onRestore(task)}
            className="flex-1 text-xs px-2 py-1 border rounded hover:bg-gray-100 cursor-pointer"
          >
            Restore
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 text-xs px-2 py-1 border rounded bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
