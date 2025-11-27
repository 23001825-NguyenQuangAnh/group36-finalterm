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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      )
        setIsProfileOpen(false);

      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target))
        setIsNotificationsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load Notifications
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

  const handleNotifClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false);
    loadNotifications();
  };

  const handleReadNotification = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markAsRead(id);
  };

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
    <header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md border-b shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold shadow-sm select-none">
          AI
        </div>

        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          AI Work Manager
        </h1>

        <nav className="ml-6 flex gap-1 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-md transition-all cursor-pointer
${
  activeTab === item.id
    ? "bg-blue-600 text-white shadow-sm"
    : "text-gray-600 hover:bg-gray-100"
}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* NOTIFICATIONS */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={handleNotifClick}
            className="relative p-2 rounded-md hover:bg-gray-100 transition cursor-pointer
"
          >
            <span className="text-[20px]">🔔</span>
            {notifications.some((n) => !n.isRead) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-80 bg-white shadow-xl 
              border border-gray-200 rounded-lg z-20 max-h-[350px] 
              overflow-y-auto animate-fadeIn"
            >
              <div className="px-4 py-2 font-semibold text-gray-700 border-b sticky top-0 bg-white z-10">
                Thông báo ({notifications.filter((n) => !n.isRead).length})
              </div>

              {loadingNotifications ? (
                <div className="px-4 py-3 text-gray-500">Đang tải...</div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-3 text-gray-500">
                  Không có thông báo 🎉
                </div>
              ) : (
                notifications.map((noti) => (
                  <div
                    key={noti.id}
                    onClick={() => handleReadNotification(noti.id)}
                    className={`px-4 py-2 cursor-pointer border-b 
                    hover:bg-gray-100 transition ${
                      !noti.isRead ? "bg-yellow-50" : ""
                    }`}
                  >
                    <p className="font-medium">{noti.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(noti.sentAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        {isLoggedIn ? (
          <div className="relative" ref={profileMenuRef}>
            {/* FIXED PROFILE BUTTON (luôn nền trắng) */}
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 
              bg-white border border-gray-300 rounded-md 
              text-gray-800 hover:bg-gray-100 shadow-sm transition cursor-pointer
"
            >
              <span className="font-medium">{displayName}</span>

              <svg
                className={`w-4 h-4 transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                } text-gray-500`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 9.75l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white shadow-xl 
                border border-gray-200 rounded-lg py-2 z-20 animate-fadeIn"
              >
                <button
                  className="block w-full text-left px-4 py-2 text-sm 
                  text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer
"
                >
                  Hồ sơ cá nhân
                </button>

                <button
                  className="block w-full text-left px-4 py-2 text-sm 
                  text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer
"
                >
                  Cài đặt tài khoản
                </button>

                <div className="border-t my-1 border-gray-200"></div>

                <button
                  onClick={handleLogoutClick}
                  className="block w-full text-left px-4 py-2 text-sm 
                  text-red-600 hover:bg-red-50 transition-colors cursor-pointer
"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginLogout}
            className="px-3 py-2 bg-blue-600 text-white rounded-md 
            shadow hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
