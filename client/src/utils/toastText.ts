export const notifications: Record<string, { description: string }> = {
  "Login Failed": {
    description:
      "Incorrect email or password. Please check your credentials and try again.",
  },
  "Registration failed": {
    description:
      "Failed to create account. Please check your input and try again.",
  },
  "User Already Exists": {
    description:
      "This email is already registered. Please log in or use password recovery.",
  },
  "Registration Successful": {
    description:
      "Welcome! Your account has been created successfully. You can now log in.",
  },
  "Login Successful": {
    description: "Welcome back! You have been successfully logged in.",
  },
  "Account Verified": {
    description:
      "Your email has been verified successfully. You can now use all features.",
  },
  "Password Reset Sent": {
    description:
      "Check your email for the password reset link. It expires in 1 hour.",
  },
  "Password Changed": {
    description:
      "Your password has been updated successfully. Please log in with new credentials.",
  },
  "Email Confirmed": {
    description:
      "Thank you for confirming your email. Your account is now fully activated.",
  },
  "Session Expired": {
    description: "Your session has expired. Please log in again to continue.",
  },
  "Account Locked": {
    description:
      "Too many failed attempts. Account temporarily locked. Try again in 15 minutes.",
  },
};
