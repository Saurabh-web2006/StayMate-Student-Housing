import { useState } from "react";
import "./Login1.css"; 
import FormInput from "../components/FormInput"; 

import logo from "../assets/logo.png";
import { validateIdentifier, validatePassword } from "./utils/validation";

function OwnerLogin({
  onGetStarted,
  onForgotPassword,
  onLegal,
  onOwnerLogin,
  onBack, 
}) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
  });

  const validateField = (name, value) => {
    if (name === "identifier") return validateIdentifier(value);
    if (name === "password") return validatePassword(value);
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const hasCurrentError = Array.isArray(errors[name])
      ? errors[name].length > 0
      : Boolean(errors[name]);

    if (hasCurrentError) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleOwnerSubmit = (e) => {
    e.preventDefault();

    const identifierError = validateIdentifier(formData.identifier);
    const passwordError = validatePassword(formData.password);

    const hasPasswordError = Array.isArray(passwordError)
      ? passwordError.length > 0
      : Boolean(passwordError);

    if (identifierError || hasPasswordError) {
      setErrors({
        identifier: identifierError,
        password: passwordError,
      });
      return;
    }

    if (onOwnerLogin) {
      onOwnerLogin(formData);
    }
  };

  return (
    <div className="auth-page owner-auth-page">
      {/* Left Side: Hero Section for Property Owners */}
      <div className="login-left">
        <div className="staymate-logo">
          <img src={logo} alt="StayMate Logo" />
          <div>
            Stay<span>Mate</span>
          </div>
        </div>

        <div className="login-hero">
          <h1>
            List your property &
            <br />
            <span>grow your PG business.</span>
          </h1>

          <p>
            Connect directly with verified university students,
            <br />
            manage bookings effortlessly and fill vacancies faster.
          </p>

          <div className="login-features">
            <div className="login-feature">
              <div className="feature-icon blue">✓</div>
              <div>
                <h3>Verified Student Tenants</h3>
                <p>
                  Rent to genuine students from
                  <br />
                  trusted colleges & universities.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon green">📊</div>
              <div>
                <h3>Smart Property Dashboard</h3>
                <p>
                  Track room availability, rent
                  <br />
                  and tenant requests in one place.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <div className="feature-icon purple">🏠</div>
              <div>
                <h3>Zero Hassle Listing</h3>
                <p>
                  Upload photos, set house rules
                  <br />
                  and go live in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Property Owner Login Card */}
      <div className="login-right">
        <div className="staymate-login-card">
          <button type="button" className="back-button" onClick={onBack}>
            ← Back
          </button>

          <h2>
            <span>StayMate</span> Partner Portal
          </h2>

          <p className="login-subtitle">
            Welcome back, Property Owner 🏠
          </p>

          <div className="login-tab">Property Owner Login</div>

          <form onSubmit={handleOwnerSubmit} noValidate>
            <FormInput
              label="Owner Email or Phone Number"
              name="identifier"
              type="text"
              icon="✉"
              placeholder="Enter registered email or phone number"
              value={formData.identifier}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.identifier}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              icon="🔒"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
            />

            <div className="forgot-password">
              <button
                type="button"
                className="forgot-link"
                onClick={onForgotPassword}
              >
                <span>🔐</span>
                Forgot Password?
                <span className="forgot-arrow">→</span>
              </button>
            </div>

            <button type="submit" className="auth-button">
              Login to Owner Dashboard
              <span>→</span>
            </button>
          </form>

          <div className="auth-divider"></div>

          <div className="switch-auth">
            Want to list your PG or Hostel?
            <button type="button" onClick={onGetStarted}>
              Register Property
            </button>
          </div>

          <div className="legal-box">
            <div className="legal-shield">🛡️</div>

            <div className="legal-content">
              <p className="legal-main-text">Partner Protection & Privacy</p>

              <p className="legal-sub-text">By continuing, you agree to our</p>

              <div className="legal-links">
                <button type="button" onClick={onLegal}>
                  Terms of Service
                </button>

                <span>•</span>

                <button type="button" onClick={onLegal}>
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

export default OwnerLogin;