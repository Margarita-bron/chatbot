import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    console.log("No user, redirecting to /");
    return <Navigate to="/" replace />;
  }
  console.log("ProtectedRoute", user);
  return children;
}
