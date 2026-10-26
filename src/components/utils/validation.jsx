
export const validateRequired = (value, fieldName) => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return "";
};

export const validateIdentifier = (value) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Email or phone number is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

  if (!emailRegex.test(trimmed) && !phoneRegex.test(trimmed)) {
    return "Please enter a valid email address or 10-digit phone number";
  }

  return "";
};

export const validatePassword = (value) => {
  if (!value) {
    return ["Password is required"];
  }

  const passwordErrors = [];

  if (value.length < 6) {
    passwordErrors.push("At least 6 characters long");
  }
  if (!/[A-Z]/.test(value)) {
    passwordErrors.push("At least 1 capital letter (A-Z)");
  }
  if (!/\d/.test(value)) {
    passwordErrors.push("At least 1 digit (0-9)");
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=~`';]/.test(value)) {
    passwordErrors.push("At least 1 special character (!@#$...)");
  }

  return passwordErrors.length > 0 ? passwordErrors : "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
};