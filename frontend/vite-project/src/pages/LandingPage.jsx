// src/pages/LandingPage.jsx
import React from 'react';

// Component này chỉ là một trang tĩnh đơn giản
// Nó nhận một prop là `onLogin` để gọi khi người dùng nhấp vào nút đăng nhập
export default function LandingPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      
      {/* 1. Header tối giản cho Landing Page */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
        {/* Logo/Title */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl font-semibold">
            AI
          </div>
          <h1 className="text-xl font-semibold">AI Work Manager</h1>
        </div>
        
        {/* Nút Đăng nhập ở góc phải phía trên */}
        <button
          onClick={onLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium shadow hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </header>

      {/* 2. Nội dung giới thiệu chính */}
      <main className="max-w-4xl mx-auto py-16 md:py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Chào mừng đến với AI Work Manager
        </h2>
        <p className="text-lg text-gray-600 mb-10 px-4">
          Tổ chức công việc, quản lý thời gian và tăng hiệu suất của bạn
          với sự trợ giúp của trí tuệ nhân tạo.
        </p>

        {/* Khối giới thiệu tính năng */}
        <div className="bg-white p-8 rounded-lg shadow-md border max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl font-semibold mb-5">Tính năng nổi bật</h3>
          <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
            <li>Quản lý tác vụ thông minh (Dashboard Kanban).</li>
            <li>Theo dõi hiệu suất làm việc (Performance Overview).</li>
            <li>Đồng bộ hóa lịch (Calendar & Sync).</li>
            <li>Gợi ý thông minh từ AI để tối ưu hóa công việc.</li>
          </ul>
        </div>
        
        {/* Nút kêu gọi hành động (cũng là nút đăng nhập) */}
        <button
          onClick={onLogin}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700"
        >
          Bắt đầu ngay (Đăng nhập Demo)
        </button>
      </main>
      
      {/* 3. Footer */}
      <footer className="text-center text-xs text-gray-500 py-6 absolute bottom-0 w-full">
        Prototype • AI Work Manager
      </footer>
    </div>
  );
}