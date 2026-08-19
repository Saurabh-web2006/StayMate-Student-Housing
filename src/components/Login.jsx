import { useState } from "react";
import "./Login.css";

import logo from "../assets/logo.png";

function Login({
  onGetStarted,
  onForgotPassword,
  onLegal,
  onLogin
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    onLogin();
  };

  return (
    <div className="auth-page">

      {/* ================= LEFT SIDE ================= */}

      <div className="login-left">

        <div className="staymate-logo">
          <img src={logo} alt="StayMate Logo" />

          <div>
            Stay<span>Mate</span>
          </div>
        </div>

        <div className="login-hero">

          <h1>
            Find a place
            <br />
            <span>you’ll love to call home.</span>
          </h1>

          <p>
            Verified PGs, comfortable stays and compatible
            <br />
            roommates — all in one place for students.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <div className="feature-icon blue">
                ✓
              </div>

              <div>
                <h3>Verified & Trusted</h3>
                <p>
                  All PG listings are verified for your
                  <br />
                  safety and peace of mind.
                </p>
              </div>
            </div>


            <div className="login-feature">
              <div className="feature-icon green">
                ♧
              </div>

              <div>
                <h3>Find Compatible Roommates</h3>
                <p>
                  Match with students based on lifestyle
                  <br />
                  and preferences.
                </p>
              </div>
            </div>


            <div className="login-feature">
              <div className="feature-icon purple">
                ⌂
              </div>

              <div>
                <h3>Easy & Convenient</h3>
                <p>
                  Search, connect and book PGs
                  <br />
                  in just a few steps.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="login-right">

        {/* EVERYTHING IS INSIDE THIS CARD */}

        <div className="staymate-login-card">

          <h2>
            Welcome to <span>StayMate</span>
          </h2>

          <p className="login-subtitle">
            Let's get you started 👋
          </p>


          <div className="login-tab">
            Login
          </div>


          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email or Phone Number
              </label>

              <div className="input-container">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  type="text"
                  placeholder="Enter your email or phone number"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password
              </label>

              <div className="input-container">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>


            {/* FORGOT PASSWORD */}

            <div className="forgot-password">

              <button
                type="button"
                className="forgot-link"
                onClick={onForgotPassword}
              >
                <span>🔐</span>
                Forgot Password?
                <span className="forgot-arrow">
                  →
                </span>
              </button>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="auth-button"
            >
              Login
              <span>→</span>
            </button>

          </form>


          {/* DIVIDER */}

          <div className="auth-divider"></div>


          {/* SIGN UP */}

          <div className="switch-auth">

            Don't have an account?

            <button onClick={onGetStarted}>
              Get Started
            </button>

          </div>


          {/* ===============================
              LEGAL BOX
              INSIDE LOGIN CARD
          =============================== */}

          <div className="legal-box">

            <div className="legal-shield">
              🛡️
            </div>

            <div className="legal-content">

              <p className="legal-main-text">
                Your privacy matters to us
              </p>

              <p className="legal-sub-text">
                By continuing, you agree to our
              </p>

              <div className="legal-links">

                <button
                  type="button"
                  onClick={onLegal}
                >
                  Terms of Service
                </button>

                <span>•</span>

                <button
                  type="button"
                  onClick={onLegal}
                >
                  Privacy Policy
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;