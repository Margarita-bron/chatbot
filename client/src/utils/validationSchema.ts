import * as yup from "yup";

export const authSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, "Email is invalid"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Must have at least one lowercase letter")
    .matches(/[A-Z]/, "Must have at least one uppercase letter")
    .matches(/\d/, "Must have at least one digit")
    .matches(
      /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/,
      "Must have at least one special character",
    ),
});
export type AuthFormValues = yup.InferType<typeof authSchema>;
