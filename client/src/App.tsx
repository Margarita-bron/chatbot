import { useState, useEffect } from "react";
import type { UserType } from "./types/types";
import AuthScreen from "./screens/AuthScreen";
import ChatBotScreen from "./screens/ChatBotScreen";
import "./App.css";
import "./index.css";

//const API_BASE = "https://chatbot-no4u.onrender.com";
const API_BASE = "http://localhost:5000";

function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const userData = await res.json();
        setUser(userData);
      } catch (err) {
        console.error("Auth check error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Logout error:", err);
        return;
      }

      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">ChatBot Assistant</h1>
          <p className="hero-subtitle">
            Securely chat with AI, powered by Supabase and Node.js
          </p>
          <AuthScreen setUser={setUser} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <main>
        <ChatBotScreen user={user} />
      </main>
    </div>
  );
}

export default App;
/*      <header>
        <span>Welcome, {user.email}</span>
        <button onClick={logout}>Logout</button>
      </header>*/
