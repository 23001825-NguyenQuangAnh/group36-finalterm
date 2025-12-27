import React, { useEffect, useMemo, useState } from "react";
import { getAllTasks } from "../api/taskApi";

export default function CalendarView({ onOpenTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // === Chuẩn hóa ngày về 00:00 để tránh lệch timezone ===
  function normalizeDate(dateString) {
    if (!dateString) return null;
    const d = new Date(dateString);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function isSameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getAllTasks();
      setTasks(res.data.result || []);
    } catch (err) {
      console.error("❌ Lỗi load task:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==== Lấy thông tin tháng ====
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const startPadding = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const totalCells = Math.ceil((daysInMonth + startPadding) / 7) * 7;

  const today = new Date();
  const todayNormalized = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // ==== Gom task theo ngày ====
  const tasksByDate = useMemo(() => {
    const grouped = {};

    tasks.forEach((t) => {
      if (!t.deadline) return;

      const d = normalizeDate(t.deadline);
      const key = d.toISOString().split("T")[0];

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    });

    return grouped;
  }, [tasks]);

  // ==== Build cell ====
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startPadding + 1;
    const date =
      dayNum > 0 && dayNum <= daysInMonth
        ? new Date(year, month, dayNum)
        : null;
    return { dayNum, date };
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () =>
    setCurrentDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );

  const monthName = currentDate.toLocaleString("vi-VN", { month: "long" });

  const priorityColors = {
    HIGH: "bg-red-200 text-red-700",
    NORMAL: "bg-blue-100 text-blue-700",
    LOW: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="p-6">
      {/* 🎯 BỎ HẲN DÒNG TITLE “Calendar”  */}
      {/* <h2 className="text-2xl font-semibold mb-4">Calendar</h2> */}

      {/* Điều hướng tháng */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={prevMonth}
          className="px-3 py-1 bg-indigo-300 text-white rounded-lg hover:bg-indigo-400 text-sm font-medium"
        >
          &lt; Tháng trước
        </button>

        <h3 className="text-xl font-semibold capitalize">
          {monthName} {year}
        </h3>

        <button
          onClick={nextMonth}
          className="px-3 py-1 bg-indigo-300 text-white rounded-lg hover:bg-indigo-400 text-sm font-medium"
        >
          Tháng sau &gt;
        </button>
      </div>

      {/* Nút "Hôm nay" */}
      <div className="flex justify-center mb-2">
        <button
          onClick={goToday}
          className="px-4 py-[6px] bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Hôm nay
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-500 italic mb-4">
          Đang tải dữ liệu...
        </div>
      )}

      {/* 🔥 ĐẨY LỊCH LÊN SÁT – chỉ cần mt-1 hoặc mt-0 */}
      <div className="bg-white p-4 rounded shadow-sm mt-1">
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-700 mb-2">
          <div>Thứ 2</div>
          <div>Thứ 3</div>
          <div>Thứ 4</div>
          <div>Thứ 5</div>
          <div>Thứ 6</div>
          <div>Thứ 7</div>
          <div>Chủ Nhật</div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-sm text-gray-600">
          {cells.map(({ dayNum, date }, i) => {
            if (!date) return <div key={i} className="h-20"></div>;

            const localDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            );
            const dateKey = localDate.toISOString().split("T")[0];

            const isToday = isSameDay(localDate, todayNormalized);
            const dayTasks = tasksByDate[dateKey] || [];

            return (
              <div
                key={i}
                className={`border rounded p-2 h-28 overflow-hidden ${
                  isToday
                    ? "bg-blue-50 border-blue-400"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`text-xs mb-1 ${
                    isToday
                      ? "text-blue-700 font-bold"
                      : "text-gray-600 font-medium"
                  }`}
                >
                  {dayNum}
                </div>

                <div className="flex flex-col gap-[4px] max-h-[80px] overflow-y-auto pr-1">
                  {dayTasks.length > 0 ? (
                    dayTasks.map((t) => (
                      <div
                        key={t.id}
                        title={t.title}
                        onClick={() => onOpenTask?.(t)}
                        className={`text-[11px] rounded px-2 py-[3px] truncate shadow-sm cursor-pointer hover:opacity-80 ${
                          priorityColors[t.priorityLevel] ||
                          "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {t.title}
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-gray-400 italic">
                      &nbsp;
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
