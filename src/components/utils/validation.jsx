
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

const PROFILE_SELECT_OPTIONS = {
  gender: ["Male", "Female", "Non-binary", "Prefer not to say"],
  food: ["Vegetarian", "Non-Vegetarian"],
  lifestyle: ["Early Bird", "Night Owl", "Flexible"],
};

export const validateProfileField = (fieldName, value) => {
  const fieldValue = typeof value === "string" ? value.trim() : String(value ?? "").trim();

  if (fieldName === "name") {
    if (!fieldValue) return "Full name is required";
    if (fieldValue.length > 80) return "Name must be 80 characters or fewer";
    if (!/^[\p{L}\p{M}][\p{L}\p{M}\s'.-]*$/u.test(fieldValue)) {
      return "Use letters, spaces, apostrophes, periods, or hyphens";
    }
    return "";
  }

  if (fieldValue === "") return "";

  if (fieldName === "age") {
    const age = Number(fieldValue);
    if (!Number.isInteger(age) || age < 16 || age > 100) {
      return "Age must be a whole number between 16 and 100";
    }
    return "";
  }

  if (fieldName === "budget") {
    const budget = Number(fieldValue);
    if (!Number.isFinite(budget) || budget < 0 || budget > 10000000) {
      return "Enter a monthly budget between ₹0 and ₹1,00,00,000";
    }
    return "";
  }

  if (fieldName === "college" || fieldName === "course") {
    const label = fieldName === "college" ? "College" : "Course";
    if (fieldValue.length > 120) return `${label} must be 120 characters or fewer`;
    if ([...fieldValue].some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })) {
      return `${label} contains invalid characters`;
    }
    return "";
  }

  if (Object.hasOwn(PROFILE_SELECT_OPTIONS, fieldName)
    && !PROFILE_SELECT_OPTIONS[fieldName].includes(fieldValue)) {
    return "Choose one of the available options";
  }

  return "";
};

export const validateStudentProfile = (profile) => {
  const fieldNames = ["name", "age", "gender", "college", "course", "food", "lifestyle", "budget"];
  return fieldNames.reduce((errors, fieldName) => {
    const error = validateProfileField(fieldName, profile[fieldName]);
    if (error) errors[fieldName] = error;
    return errors;
  }, {});
};