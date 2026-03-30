import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [newChatTitle, setNewChatTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((res) => res.json())
      .then((data) => console.log("Health:", data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/chats")
      .then((res) => res.json())
      .then((data) => setChats(data));
  }, []);

  const createChat = () => {
    fetch("http://localhost:5000/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newChatTitle || "New chat" }),
    })
      .then((res) => res.json())
      .then((chat) => {
        setChats((prev) => [chat, ...prev]);
        setNewChatTitle("");
      });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Слева — список чатов */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "12px",
        }}
      >
        <h2>Chats</h2>
        <input
          value={newChatTitle}
          onChange={(e) => setNewChatTitle(e.target.value)}
          placeholder="Chat title"
          style={{ width: "100%", padding: "6px", marginBottom: "8px" }}
        />
        <button onClick={createChat} style={{ width: "100%", padding: "6px" }}>
          + New chat
        </button>
        <hr />
        <ul style={{ listStyle: "none", padding: 0 }}>
          {chats.map((chat) => (
            <li key={chat.id} style={{ padding: "6px", cursor: "pointer" }}>
              {chat.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Справа — окно чата */}
      <div style={{ flex: 1, padding: "12px" }}>
        <h1>Chatbot UI</h1>
        <p>Select or create a chat on the left.</p>
        <input
          style={{ width: "100%", padding: "10px" }}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}

export default App;
