import AuthScreen from "./screens/AuthScreen";
import ChatBotScreen from "./screens/ChatBotScreen";
import "./App.css";
import "./index.css";
import { AuthProvider, useAuth } from "./provider/useAuth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./screens/NotFound";

export const API_BASE = "https://chatbot-no4u.onrender.com";
//export const API_BASE = "http://localhost:5000";

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

    <AuthProvider>
      {" "}
      <BrowserRouter>
        <Routes>
          {" "}
          <Route path="/auth" element={<AuthScreen setUser={setUser} />} />
          <Route path="/chat" element={<ChatBotScreen user={user} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
/*      <header>
        <span>Welcome, {user.email}</span>
        <button onClick={logout}>Logout</button>
      </header>*/
