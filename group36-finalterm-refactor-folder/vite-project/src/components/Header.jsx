// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { getUserNotifications, markAsRead } from "../api/notificationApi";

export default function Header({
  activeTab,
  setActiveTab,
  isLoggedIn,
  onLoginLogout,
}) {
  // User
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = storedUser?.id || null;
  const displayName = storedUser?.email?.split("@")[0] || "User";

  // UI state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const isLoadingRef = useRef(false);

  // Logout
  const handleLogoutClick = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (token) {
        await axios.post(
          "http://localhost:8081/api/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("user");

      if (typeof onLoginLogout === "function") onLoginLogout();
      setIsProfileOpen(false);
    }
  };

  // Click outside close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }

      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load Notifications (chống spam)
  const loadNotifications = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return;

      setLoadingNotifications(true);
      const res = await getUserNotifications(user.id);
      setNotifications(res.data.result);
    } catch (error) {
      console.error("Không tải được thông báo", error);
    } finally {
      setLoadingNotifications(false);
      isLoadingRef.current = false;
    }
  };

  // Open Notif menu
  const handleNotifClick = () => {
    setIsNotificationsOpen((s) => !s);
    setIsProfileOpen(false);
    loadNotifications();
  };

  // Mark as read (UX: đánh dấu ngay)
  const handleReadNotification = async (id) => {
    // cập nhật ngay lập tức trên UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

    // gọi API sau
    await markAsRead(id);
  };

  // Load noti khi user đăng nhập
  useEffect(() => {
    loadNotifications();
  }, [loggedInUserId]);

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "dashboard", label: "Dashboard" },
    { id: "calendar", label: "Calendar" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl font-semibold">
          AI
        </div>
        <h1 className="text-xl font-semibold">AI Work Manager</h1>

        {/* Navigation */}
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

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={handleNotifClick}
            className="p-2 rounded hover:bg-gray-100 relative"
            title="Notifications"
          >
            <span className="text-xl">🔔</span>

            {notifications.some((n) => !n.isRead) && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>

          {/* Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-md shadow-lg border z-10 py-1 max-h-80 overflow-y-auto animate-[fadeIn_0.15s_ease-out]">
              <div className="px-4 py-2 font-semibold border-b">
                Thông báo mới ({notifications.filter((n) => !n.isRead).length})
              </div>

              {loadingNotifications ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Đang tải...
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Không có thông báo 🎉
                </div>
              ) : (
                notifications.map((noti) => (
                  <div
                    key={noti.id}
                    onClick={() => handleReadNotification(noti.id)}
                    className={`px-4 py-2 text-sm cursor-pointer border-b hover:bg-gray-100 ${
                      !noti.isRead ? "bg-yellow-50" : ""
                    }`}
                  >
                    <p className="font-medium line-clamp-2">{noti.message}</p>
                    <p
                      className={`text-xs ${
                        noti.isRead ? "text-gray-400" : "text-red-500"
                      }`}
                    >
                      {new Date(noti.sentAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                ))
              )}

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="block px-4 py-2 text-sm text-blue-600 text-center hover:bg-gray-100 border-t mt-1"
              >
                Xem tất cả
              </a>
            </div>
          )}
        </div>

        {/* Profile */}
        {isLoggedIn ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => {
                setIsProfileOpen((s) => !s);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition"
              title="Tài khoản"
            >
              <span className="font-medium">{displayName}</span>

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

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10 py-1 animate-[fadeIn_0.15s_ease-out]">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Hồ sơ (Profile)
                </a>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cài đặt tài khoản
                </a>

                <div className="border-t my-1"></div>

                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginLogout}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
