export const EMAIL_PATTERN = /\S+@\S+\.\S+/;

export const PASSWORD_RULES = {
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters long",
  },
  hasLowercase: {
    value: /[a-z]/,
    message: "Must have at least one lowercase letter",
  },
  hasUppercase: {
    value: /[A-Z]/,
    message: "Must have at least one uppercase letter",
  },
  hasDigit: {
    value: /\d/,
    message: "Must have at least one digit",
  },
  hasSpecialChar: {
    value: /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/,
    message: "Must have at least one special character",
  },
  secure: [
    "minLength",
    "hasLowercase",
    "hasUppercase",
    "hasDigit",
    "hasSpecialChar",
  ],
};
