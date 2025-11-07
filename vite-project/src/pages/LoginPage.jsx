import React, { useEffect } from "react";
import "./LoginPage.css";

export default function LoginPage() {
  useEffect(() => {
    // import script logic vào component React
    const script = document.createElement("script");
    script.src = "/login/script.js";
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="login-page-wrapper">
      <div className="neural-background">
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
        <div className="neural-node"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="ai-glow"></div>

          <div className="login-header">
            <div className="ai-logo">
              <div className="logo-core">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="logo-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <h1>Neural Access</h1>
            <p>Connect to your AI workspace</p>
          </div>

          <form className="login-form" id="loginForm" noValidate>
            {/* Email */}
            <div className="smart-field" data-field="email">
              <div className="field-background"></div>
              <input type="email" id="email" name="email" required autoComplete="email" />
              <label htmlFor="email">Email Address</label>
              <div className="ai-indicator"><div className="ai-pulse"></div></div>
              <div className="field-completion"></div>
              <span className="error-message" id="emailError"></span>
            </div>

            {/* Password */}
            <div className="smart-field" data-field="password">
              <div className="field-background"></div>
              <input type="password" id="password" name="password" required autoComplete="current-password" />
              <label htmlFor="password">Password</label>
              <button type="button" className="smart-toggle" id="passwordToggle" aria-label="Toggle password visibility">
                <svg className="toggle-show" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 3.75c-3.15 0-5.85 1.89-7.02 4.72a.75.75 0 000 .56c1.17 2.83 3.87 4.72 7.02 4.72s5.85-1.89 7.02-4.72a.75.75 0 000-.56C14.85 5.64 12.15 3.75 9 3.75zM9 12a3 3 0 110-6 3 3 0 010 6z"
                    fill="currentColor"
                  />
                </svg>
                <svg className="toggle-hide" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3.53 2.47a.75.75 0 00-1.06 1.06l11 11a.75.75 0 101.06-1.06l-2.82-2.82c.8-.67 1.5-1.49 2.04-2.42a.75.75 0 000-.56C12.58 4.84 10.89 3.75 9 3.75c-.69 0-1.36.1-2 .29L3.53 2.47zM7.974 5.847L10.126 8a1.5 1.5 0 01-2.126-2.126l-.026-.027z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div className="ai-indicator"><div className="ai-pulse"></div></div>
              <div className="field-completion"></div>
              <span className="error-message" id="passwordError"></span>
            </div>

            <div className="form-options">
              <label className="smart-checkbox">
                <input type="checkbox" id="remember" name="remember" />
                <span className="checkbox-ai">
                  <div className="checkbox-core"></div>
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="checkbox-text">Remember this session</span>
              </label>
              <a href="#" className="neural-link">Reset access</a>
            </div>

            <button type="submit" className="neural-button">
              <div className="button-bg"></div>
              <span className="button-text">Initialize Connection</span>
              <div className="button-loader">
                <div className="neural-spinner">
                  <div className="spinner-segment"></div>
                  <div className="spinner-segment"></div>
                  <div className="spinner-segment"></div>
                </div>
              </div>
              <div className="button-glow"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}