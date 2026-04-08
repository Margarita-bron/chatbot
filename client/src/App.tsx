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

  return (
    <div className="w-full">
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
    </div>
  );
}

export default App;
