// LoginPage.jsx
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
} from "lucide-react";

/**
 * LoginPage — Trang đăng nhập / đăng ký
 * Props:
 * - onAuthSuccess: hàm gọi sau khi đăng nhập / đăng ký thành công
 */
export default function LoginPage({ onAuthSuccess }) {
  // === State ===
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Checkbox chỉ dành cho Đăng nhập
  const [rememberMe, setRememberMe] = useState(false);

  // === Xử lý Submit ===
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (isRegister) {
      if (!name || !email || !password) {
        setError("Vui lòng nhập đầy đủ thông tin.");
        setIsLoading(false);
        return;
      }
      setTimeout(() => {
        localStorage.setItem("awm_user_name", name);
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(onAuthSuccess, 2000);
      }, 1500);
    } else {
      if (!email || !password) {
        setError("Vui lòng nhập email và mật khẩu.");
        setIsLoading(false);
        return;
      }
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(onAuthSuccess, 2000);
      }, 1500);
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex items-center justify-center p-5 relative overflow-hidden leading-normal max-sm:p-4">
      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white border border-gray-200 shadow-xl rounded-[20px] p-[40px_32px] relative overflow-hidden max-sm:p-6 max-sm:rounded-2xl">
          {!isSuccess ? (
            <div className="relative z-10">
              <div className="text-center mb-9">
                <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center max-sm:w-16 max-sm:h-16"></div>
                <h1 className="text-gray-900 text-[1.75rem] font-bold mb-2 tracking-tight max-sm:text-2xl">
                  {isRegister ? "Registration" : "Welcome!"}
                </h1>
                <p className="text-gray-600 text-sm font-normal">
                  {isRegister
                    ? "Đăng ký để bắt đầu với AI."
                    : "Đăng nhập để tiếp tục."}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {isRegister && (
                  <SmartFieldLight
                    id="name"
                    type="text"
                    label="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    hasError={!!(error && !name)}
                  />
                )}

                <SmartFieldLight
                  id="email"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  hasError={!!(error && !email)}
                />

                <SmartFieldLight
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  hasError={!!(error && !password)}
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[10px] top-1/2 -translate-y-1/2 text-black transition-all duration-200 z-[4] flex items-center justify-center"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </SmartFieldLight>

                {/* Hiển thị lỗi */}
                <div
                  className={`text-red-500 text-xs font-medium mt-[-20px] mb-[20px] transition-all duration-200 ${
                    error
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  }`}
                >
                  {error || " "}
                </div>

                {/* Checkbox chỉ xuất hiện khi Đăng nhập */}
                <div className="flex justify-between items-center mb-8 flex-wrap gap-4 max-sm:flex-col max-sm:items-start">
                  {!isRegister && (
                    <label className="flex items-center cursor-pointer text-sm text-gray-700 font-medium">
                      <input
                        type="checkbox"
                        className="peer hidden"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <div className="w-5 h-5 mr-2.5 relative flex items-center justify-center">
                        <div className="w-full h-full border-[1.5px] border-gray-400 rounded bg-gray-100 transition-all duration-300 absolute peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                        <Check
                          size={14}
                          className="text-transparent transition-colors duration-300 relative z-[1] peer-checked:text-white"
                        />
                      </div>
                      Ghi nhớ tôi
                    </label>
                  )}

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Chức năng 'Quên mật khẩu' chưa được thiết lập.");
                    }}
                    className="text-blue-600 no-underline text-sm font-medium transition-all duration-200 relative hover:text-blue-500 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-blue-600 after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white border-none rounded-xl p-0 cursor-pointer font-inherit text-[15px] font-semibold relative mb-7 overflow-hidden min-h-[50px] flex items-center justify-center disabled:cursor-not-allowed transition-all duration-300 hover:bg-blue-700 active:scale-[0.98] disabled:bg-blue-400"
                >
                  <span
                    className={`relative z-[2] transition-opacity duration-200 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {isRegister ? "Đăng ký" : "Đăng nhập"}
                  </span>

                  <div
                    className={`absolute z-[2] transition-opacity duration-200 ${
                      isLoading ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-white rounded-sm animate-neuralSpinner [animation-delay:0s]" />
                      <div className="w-1 h-4 bg-white rounded-sm animate-neuralSpinner [animation-delay:0.1s]" />
                      <div className="w-1 h-4 bg-white rounded-sm animate-neuralSpinner [animation-delay:0.2s]" />
                    </div>
                  </div>
                </button>
              </form>

              <div className="flex items-center my-7 gap-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-500 text-[13px] font-medium uppercase tracking-wider">
                  Hoặc
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-600">
                {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
                <span
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError(null);
                  }}
                  className="text-blue-600 font-semibold hover:text-blue-500 no-underline transition-all duration-200 cursor-pointer relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-blue-600 after:transition-[width] after:duration-300 after:ease-in-out hover:after:w-full"
                >
                  {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
                </span>
              </p>
            </div>
          ) : (
            <div className="text-center p-5 animate-in fade-in slide-in-from-bottom-5 duration-400">
              <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                <div className="absolute inset-0">
                  <div className="absolute w-[60px] h-[60px] top-[10px] left-[10px] border-2 border-emerald-500 rounded-full animate-successRing [animation-delay:0s]" />
                  <div className="absolute w-[70px] h-[70px] top-[5px] left-[5px] border-2 border-emerald-500 rounded-full animate-successRing [animation-delay:0.2s]" />
                  <div className="absolute w-20 h-20 top-0 left-0 border-2 border-emerald-500 rounded-full animate-successRing [animation-delay:0.4s]" />
                </div>
                <CheckCircle2
                  size={40}
                  className="text-emerald-500 relative z-[2] animate-successCheck opacity-0"
                />
              </div>
              <h3 className="text-gray-900 text-2xl font-bold mb-2">
                {isRegister ? "Đăng ký thành công!" : "Đăng nhập thành công!"}
              </h3>
              <p className="text-gray-600 text-sm">
                Đang chuyển hướng bạn đến bảng điều khiển...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SmartFieldLight Component ---
function SmartFieldLight({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  hasError,
  children,
}) {
  return (
    <div className={`relative mb-7 ${hasError ? "error" : ""}`}>
      <div
        className={`absolute inset-0 bg-white border border-gray-300 rounded-xl transition-all duration-300 ease-in-out 
          peer-focus:border-blue-600 peer-focus:shadow-[0_0_0_1px_rgba(59,130,246,0.5)]
          ${hasError ? "border-red-500 bg-red-50" : ""}`}
      />

      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        placeholder=" "
        className={`peer w-full bg-transparent border-none p-4 text-gray-900 text-[15px] font-normal outline-none relative z-[2] font-inherit placeholder-transparent 
          ${children ? "pr-[90px]" : "pr-[50px]"}`}
      />

      <label
        htmlFor={id}
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[15px] font-normal pointer-events-none transition-all duration-300 ease-in-out z-[3] bg-white px-1
          peer-focus:top-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-blue-600
          peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:text-blue-600
          ${hasError ? "text-red-500 peer-focus:text-red-500" : ""}`}
      >
        {label}
      </label>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 z-[4]">
        <div className="w-full h-full bg-blue-600 rounded-full opacity-0 peer-focus:animate-aiIndicator" />
      </div>

      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-500 w-0 transition-[width] duration-500 ease-in-out rounded-b-xl peer-valid:w-full ${
          hasError ? "bg-red-500" : ""
        }`}
      />

      {children}
    </div>
  );
}
