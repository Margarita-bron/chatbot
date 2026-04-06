import { useState } from "react";
import type { UserType } from "../types/types";
import { useForm, type Resolver } from "react-hook-form";
import "../styles/auth.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { type AuthFormValues, authSchema } from "../utils/validationSchema";
import { API_BASE } from "../App";

type Mode = "login" | "register";

function AuthScreen({ setUser }: { setUser: (user: UserType | null) => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    mode: "onSubmit",
    resolver: yupResolver(authSchema) as Resolver<AuthFormValues>,
  });

  const onSubmit = async (data: AuthFormValues) => {
    if (Object.keys(errors).length > 0) {
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE}/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorMessage(err.error || "Something went wrong");
        return;
      }

      const newUser = await res.json();
      setUser(newUser);
    } catch (err) {
      setErrorMessage(`Network error:${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-toggle">
        <button
          type="button"
          className={`toggle-button ${mode === "login" ? "active" : ""}`}
          onClick={() => setMode("login")}
          disabled={loading}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`toggle-button ${mode === "register" ? "active" : ""}`}
          onClick={() => setMode("register")}
          disabled={loading}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-group">
          <input
            {...register("email")}
            placeholder="Email"
            type="email"
            className={`input ${errors.email ? "error" : ""}`}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="input-group">
          <input
            {...register("password")}
            placeholder="Password"
            type="password"
            className={`input ${errors.password ? "error" : ""}`}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        {errorMessage && (
          <p className="error-message server-error">{errorMessage}</p>
        )}

        <button type="submit" disabled={loading} className="auth-submit-button">
          {loading ? "Loading..." : mode === "login" ? "Sign in" : "Register"}
        </button>
      </form>
    </>
  );
}
export default AuthScreen;
