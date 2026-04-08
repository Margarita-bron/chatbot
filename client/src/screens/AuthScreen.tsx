import { useState } from "react";
import type { UserType } from "../types/types";
import { useForm, type Resolver } from "react-hook-form";
import "../styles/auth.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { type AuthFormValues, authSchema } from "../utils/validationSchema";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const onSubmit = async (data: AuthFormValues) => {
    if (Object.keys(errors).length > 0) {
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const newUser = await res.json();
      console.log("edgrerger", newUser);
      if (!res.ok) {
        setLoading(false);
        setErrorMessage(newUser.error || "Something went wrong");
        return;
      }

      localStorage.setItem("accessToken", newUser.accessToken);

      setUser(newUser.user);
      navigate("/chat");
    } catch (err) {
      setErrorMessage(`Network error:${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">ChatBot Assistant</h1>
          <p className="hero-subtitle">
            Securely chat with AI, powered by Supabase and Node.js
          </p>
          <div className="auth-toggle">
            <button
              type="button"
              className={`font-bold py-2 px-7 rounded-full rounded-r ${
                mode === "login"
                  ? "bg-indigo-400 text-white hover:bg-indigo-500"
                  : "bg-indigo-200  text-indigo-500 hover:bg-indigo-300"
              }`}
              onClick={() => setMode("login")}
              disabled={loading}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`font-bold py-2 px-6 rounded-full rounded-l ${
                mode === "register"
                  ? "bg-indigo-400 text-white hover:bg-indigo-500"
                  : "bg-indigo-200  text-indigo-500 hover:bg-indigo-300"
              }`}
              onClick={() => setMode("register")}
              disabled={loading}
            >
              Register
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col w-full auth-form"
          >
            <div className={`${!errors.email ? "mb-7" : "mb-2"}`}>
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

            <div>
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

            <button
              type="submit"
              disabled={
                errors.email?.message || errors.password?.message || loading
                  ? true
                  : false
              }
              className="mt-auto bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 border-b-4 border-indigo-700 hover:border-indigo-600 rounded-full"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : mode === "login" ? (
                "Sign in"
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default AuthScreen;
