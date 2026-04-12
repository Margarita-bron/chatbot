import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { UserType } from "../types/types";
import { useToast } from "./ToastContext";

export type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: Dispatch<SetStateAction<UserType | null>>;
};
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  logout: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    async function checkAuth() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        console.log("User state changed: !token", user, loading);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          console.warn("error 401 reauthorize");
          localStorage.removeItem("accessToken");
          setLoading(false);
          setUser(null);
          return;
        }

        if (!res.ok) {
          showToast(
            {
              title: "Server error",
              description: '"Server error, but token kept"',
            },
            "error",
          );
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        showToast(
          {
            title: "Network error, keeping token",
            description: String(err),
          },
          "error",
        );
      } finally {
        setLoading(false);
        console.log("/me user ", user);
      }
    }

    checkAuth();
  }, []);
  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);
  const logout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await fetch(`${import.meta.env.VITE_API_BASE}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      localStorage.removeItem("accessToken");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
