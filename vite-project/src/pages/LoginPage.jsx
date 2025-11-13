import React, { useState } from "react";

/**
 * LoginPage — Trang đăng nhập / đăng ký đơn giản có nhập tên
 * Props:
 *  - onAuthSuccess: hàm gọi sau khi đăng nhập / đăng ký thành công
 */
export default function LoginPage({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      // === Xử lý ĐĂNG KÝ ===
      if (!name || !email || !password) {
        alert("Vui lòng nhập đầy đủ thông tin đăng ký!");
        return;
      }
      localStorage.setItem("awm_user_name", name);
      alert(`Chào mừng ${name}! Đăng ký thành công 🎉`);
    } else {
      // === Xử lý ĐĂNG NHẬP ===
      if (!email || !password) {
        alert("Vui lòng nhập email và mật khẩu!");
        return;
      }
      const savedName = localStorage.getItem("awm_user_name") || "Người dùng";
      alert(`Xin chào ${savedName}! Đăng nhập thành công ✅`);
    }

    onAuthSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {isRegister ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
          </span>
        </p>

      </div>
    </div>
  );
}
