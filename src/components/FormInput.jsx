
import { useState } from "react";

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  icon,
  error,
  groupClass = "form-group",
  containerClass = "input-container",
  iconClass = "input-icon",
  toggleClass = "password-toggle",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const hasError = Array.isArray(error) ? error.length > 0 : Boolean(error);

  return (
    <div className={groupClass}>
      {label && <label htmlFor={name}>{label}</label>}

      <div className={`${containerClass} ${hasError ? "input-error-border" : ""}`}>
        {icon && <span className={iconClass}>{icon}</span>}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={hasError}
        />

        {isPassword && (
          <button
            type="button"
            className={toggleClass}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        )}
      </div>

      {hasError && (
        Array.isArray(error) ? (
          <ul className="error-list">
            {error.map((errMsg, index) => (
              <li key={index} className="error-message">
                {errMsg}
              </li>
            ))}
          </ul>
        ) : (
          <span className="error-message">{error}</span>
        )
      )}
    </div>
  );
}

export default FormInput;