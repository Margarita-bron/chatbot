import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./provider/useAuth";

export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}
