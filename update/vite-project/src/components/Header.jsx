import React, { useState, useRef, useEffect } from "react";

export default function Header({
  userName = "User",
  activeTab,
  setActiveTab,
  onSync,
  isLoggedIn,
  onLoginLogout,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    onLoginLogout();
    setIsProfileOpen(false);
  };

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "dashboard", label: "Dashboard" },
    { id: "calendar", label: "Calendar" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm sticky top-0 z-30">
      {/* --- Logo & Navigation --- */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-semibold shadow-sm">
          AI
        </div>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          AI Work Manager
        </h1>

        <nav className="ml-6 hidden md:flex gap-1 text-sm text-gray-700 font-medium">
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
        {/* Sync button */}
        <button
          onClick={onSync}
          className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm transition"
        >
          🔄 Sync
        </button>

        {/* Notification (demo) */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition"
          title="Notifications"
        >
          <span className="text-lg">🔔</span>
        </button>

        {/* --- User profile / login logic --- */}
        {isLoggedIn ? (
          <div className="relative" ref={profileMenuRef}>
            {/* Avatar + name */}
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

            {/* Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fadeIn">
                <div className="py-2 text-sm text-gray-700">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 hover:bg-gray-100 rounded transition"
                  >
                    Hồ sơ (Profile)
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="block px-4 py-2 hover:bg-gray-100 rounded transition"
                  >
                    Cài đặt tài khoản
                  </a>
                  <div className="border-t my-1"></div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left block px-4 py-2 text-red-600 hover:bg-gray-100 rounded transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
}
