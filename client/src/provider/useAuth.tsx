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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("checkAuth", token);
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("/me", res);
        if (!res.ok) {
          localStorage.removeItem("accessToken");
          setLoading(false);
          setUser(null);
        } else {
          const data = await res.json();
          console.log("User data from server:", data);
          setUser(data);
          console.log("/me user ", data, user);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        localStorage.removeItem("accessToken");

        setUser(null);
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
