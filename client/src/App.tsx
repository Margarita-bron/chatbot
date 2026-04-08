import AuthScreen from "./screens/AuthScreen";
import ChatBotScreen from "./screens/ChatBotScreen";
import "./App.css";
import "./index.css";
import { AuthProvider, useAuth } from "./provider/useAuth";
import { Route, Routes } from "react-router-dom";
import NotFound from "./screens/NotFound";
import { useEffect } from "react";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";

//export const API_BASE = "https://chatbot-no4u.onrender.com";

function App() {
  const { user, loading, logout, setUser } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  /*if (!user) {
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
  }*/

  return (
    /* <div>
      <main>
        <ChatBotScreen user={user} />
      </main>
    </div>*/

    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <AuthScreen setUser={setUser} />
          </PublicRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatBotScreen user={user!} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
/*      <header>
        <span>Welcome, {user.email}</span>
        <button onClick={logout}>Logout</button>
      </header>*/
