// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";

export default function Header({
  userName = "User",
  activeTab,
  setActiveTab,
  onSync,
  isLoggedIn,
  onLoginLogout,
}) {
  // State để quản lý việc mở/đóng menu profile
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Ref để theo dõi phần tử menu
  const profileMenuRef = useRef(null);

  // Xử lý khi nhấn nút Đăng xuất
  const handleLogoutClick = () => {
    onLoginLogout();
    setIsProfileOpen(false); // Đóng menu sau khi đăng xuất
  };

  // Tự động đóng menu khi nhấp ra bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    // Thêm event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Dọn dẹp event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "dashboard", label: "Dashboard" },
    { id: "calendar", label: "Calendar" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl font-semibold">
          AI
        </div>
        <h1 className="text-xl font-semibold">AI Work Manager</h1>
        <nav className="ml-6 flex gap-2 text-sm text-gray-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* --- Right actions --- */}
      <div className="flex items-center gap-3">
        <button 
         onClick={onSync} 
         className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm transition">
          Sync
        </button>

        {/* Mục thông báo (demo) */}
        <button className="p-2 rounded hover:bg-gray-100" title="Notifications">
          <span className="text-xl">🔔</span>
        </button>

        {/* Logic Đăng nhập / Profile Người dùng MỚI */}
        {isLoggedIn ? (
          // Container cho menu dropdown
          <div className="relative" ref={profileMenuRef}>
            {/* Nút bấm để mở/đóng menu */}
            <button
              onClick={() => setIsProfileOpen((s) => !s)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition"
              title="Tài khoản"
            >
              <span className="font-medium">{userName}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : "rotate-0"
                } text-gray-500`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 9.75l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {/* Menu dropdown (hiện/ẩn dựa trên state) */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 py-1">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()} // Link demo
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Hồ sơ (Profile)
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()} // Link demo
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Cài đặt tài khoản
                </a>
                <div className="border-t my-1"></div>
                {/* Nút đăng xuất đã được di chuyển vào đây */}
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          // Nút Đăng nhập (khi chưa login)
          <button
            onClick={onLoginLogout}
            className="px-3 py-2 bg-blue-600 text-white rounded">
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}