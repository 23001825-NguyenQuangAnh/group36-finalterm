import React, { useMemo, useState } from "react";

export default function CalendarView({ tasks = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 🧮 Tính toán thông tin tháng hiện tại
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Chủ nhật

  const startPadding = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Bắt đầu từ thứ Hai
  const totalCells = Math.ceil((daysInMonth + startPadding) / 7) * 7;

  const today = new Date();

  // 🧩 Gom task theo ngày
  const tasksByDate = useMemo(() => {
    const grouped = {};
    tasks.forEach((t) => {
      if (t.deadline) {
        const dateKey = new Date(t.deadline).toISOString().split("T")[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(t);
      }
    });
    return grouped;
  }, [tasks]);

  // 📅 Mảng các ô trong lịch
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startPadding + 1;
    const date =
      dayNum > 0 && dayNum <= daysInMonth
        ? new Date(year, month, dayNum)
        : null;
    return { dayNum, date };
  });

  const monthName = currentDate.toLocaleString("vi-VN", { month: "long" });

  // 🧭 Chuyển tháng
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Calendar</h2>

      {/* Thanh điều hướng tháng */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
        >
          &lt; Tháng trước
        </button>
        <h3 className="text-lg font-medium capitalize">
          {monthName} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
        >
          Tháng sau &gt;
        </button>
      </div>

      {/* Lưới hiển thị lịch */}
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-700 mb-2">
          <div>T2</div>
          <div>T3</div>
          <div>T4</div>
          <div>T5</div>
          <div>T6</div>
          <div>T7</div>
          <div>CN</div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-sm text-gray-600">
          {cells.map(({ dayNum, date }, i) => {
            if (!date)
              return <div key={i} className="h-20 bg-transparent"></div>;

            const dateKey = date.toISOString().split("T")[0];
            const isToday = isSameDay(date, today);
            const dayTasks = tasksByDate[dateKey] || [];

            return (
              <div
                key={i}
                className={`border rounded p-2 h-24 overflow-y-auto ${
                  isToday
                    ? "bg-blue-50 border-blue-400"
                    : "bg-gray-50 hover:bg-gray-100 transition"
                }`}
              >
                <div
                  className={`text-xs mb-1 ${
                    isToday
                      ? "text-blue-600 font-bold"
                      : "text-gray-500 font-medium"
                  }`}
                >
                  {dayNum}
                </div>

                {dayTasks.length > 0 ? (
                  dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      title={t.title}
                      className="text-[11px] bg-blue-100 text-blue-700 rounded px-1 truncate"
                    >
                      {t.title}
                    </div>
                  ))
                ) : (
                  <div className="text-[11px] text-gray-400 italic">&nbsp;</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// === Helper so sánh ngày ===
function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
