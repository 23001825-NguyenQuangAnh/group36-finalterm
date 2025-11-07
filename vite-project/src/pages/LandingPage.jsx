import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * LandingPage — Trang chào mừng người dùng.
 * Khi nhấn nút "Đăng nhập", chuyển hướng sang /login
 */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 ">
      {/* Header tối giản */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
        {/* Logo + tiêu đề */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl font-semibold">
            AI
          </div>
          <h1 className="text-xl font-semibold">AI Work Manager</h1>
        </div>

        {/* Nút đăng nhập (góc phải) */}
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium shadow hover:bg-blue-700 transition duration-300"
          aria-label="Đăng nhập demo"
        >
          Đăng nhập
        </button>
      </header>

      {/*  Nội dung chính */}
      <main className="flex-grow max-w-4xl mx-auto py-16 md:py-24 text-center">
        {/* Tiêu đề chính */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Chào mừng đến với{" "}
          <span className="text-blue-600">AI Work Manager</span>
        </h2>

        {/* Mô tả */}
        <p className="text-lg text-gray-600 mb-10 px-4">
          Tổ chức công việc, quản lý thời gian và tăng hiệu suất của bạn với sự
          trợ giúp của trí tuệ nhân tạo.
        </p>

        {/* giới thiệu tính năng */}
        <div className="bg-white p-8 rounded-lg shadow-md border max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl font-semibold mb-5">Tính năng nổi bật</h3>
          <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
            <li>Quản lý tác vụ thông minh (Dashboard Kanban).</li>
            <li>Theo dõi hiệu suất làm việc (Performance Overview).</li>
            <li>Đồng bộ hóa lịch (Calendar & Sync).</li>
            <li>Gợi ý thông minh từ AI để tối ưu hóa công việc.</li>
          </ul>
        </div>

        {/* Nút hành động */}
        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Bắt đầu ngay (Đăng nhập Demo)
        </button>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-6">
        Prototype • AI Work Manager
      </footer>
    </div>
  );
}
