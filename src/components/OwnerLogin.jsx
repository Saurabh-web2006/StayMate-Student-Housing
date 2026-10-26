import { useState } from "react";
import "./Login1.css"; 
import FormInput from "../components/FormInput"; 

import logo from "../assets/logo.png";
import {
  validateConfirmPassword,
  validateIdentifier,
  validatePassword,
  validateProfileField,
} from "./utils/validation";

function OwnerLogin({
  onForgotPassword,
  onLegal,
  onOwnerLogin,
  onOwnerRegister,
  onBack,
}) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    businessName: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });

  const validateField = (name, value, currentFormData = formData) => {
    if (name === "fullName") return validateProfileField("name", value);
    if (name === "businessName") {
      const businessName = value.trim();
      if (businessName.length > 120) return "Business name must be 120 characters or fewer";
      if ([...businessName].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) {
        return "Business name contains invalid characters";
      }
      return "";
    }
    if (name === "identifier") return validateIdentifier(value);
    if (name === "password") return validatePassword(value);
    if (name === "confirmPassword") return validateConfirmPassword(currentFormData.password, value);
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    setSubmitError("");

    const hasCurrentError = Array.isArray(errors[name])
      ? errors[name].length > 0
      : Boolean(errors[name]);

    if (hasCurrentError) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, updatedFormData) }));
    }
    if (name === "password" && (updatedFormData.confirmPassword || errors.confirmPassword)) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", updatedFormData.confirmPassword, updatedFormData),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const fieldNames = isCreatingAccount
      ? ["fullName", "businessName", "identifier", "password", "confirmPassword"]
      : ["identifier", "password"];
    const nextErrors = fieldNames.reduce((result, fieldName) => {
      result[fieldName] = validateField(fieldName, formData[fieldName]);
      return result;
    }, {});
    const hasErrors = Object.values(nextErrors).some((error) => (
      Array.isArray(error) ? error.length > 0 : Boolean(error)
    ));
    setErrors((current) => ({ ...current, ...nextErrors }));
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isCreatingAccount) {
        await onOwnerRegister?.(formData);
      } else {
        await onOwnerLogin?.(formData);
      }
    } catch (error) {
      setSubmitError(error.message || "We couldn't complete your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsCreatingAccount((current) => !current);
    setErrors({ fullName: "", businessName: "", identifier: "", password: "", confirmPassword: "" });
    setSubmitError("");
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
        <div className={`staymate-login-card${isCreatingAccount ? " owner-register-card" : ""}`}>
          <button type="button" className="back-button" onClick={onBack}>
            ← Back
          </button>

          <h2>
            <span>StayMate</span> Partner Portal
          </h2>

          <p className="login-subtitle">
            {isCreatingAccount ? "Create your property host profile 🏠" : "Welcome back, Property Owner 🏠"}
          </p>

          <div className="login-tab">{isCreatingAccount ? "Create Owner Account" : "Property Owner Login"}</div>

          <form onSubmit={handleOwnerSubmit} noValidate>
            {isCreatingAccount && (
              <>
                <FormInput
                  label="Full name"
                  name="fullName"
                  icon="👤"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.fullName}
                />
                <FormInput
                  label="Business or property name (optional)"
                  name="businessName"
                  icon="🏠"
                  placeholder="e.g. Green Nest PG"
                  value={formData.businessName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.businessName}
                />
              </>
            )}

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

            {isCreatingAccount && (
              <FormInput
                label="Confirm password"
                name="confirmPassword"
                type="password"
                icon="🔒"
                placeholder="Enter your password again"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
              />
            )}

            {!isCreatingAccount && (
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
            )}

            {submitError && <p className="owner-auth-error" role="alert">{submitError}</p>}

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? "Please wait…" : isCreatingAccount ? "Create Owner Account" : "Login to Owner Dashboard"}
              {!isSubmitting && <span>→</span>}
            </button>
          </form>

          <div className="auth-divider"></div>

          <div className="switch-auth">
            {isCreatingAccount ? "Already have an owner account?" : "New to StayMate as a property owner?"}
            <button type="button" onClick={switchMode}>
              {isCreatingAccount ? "Log in" : "Create your account"}
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