import { useEffect, useState } from "react";
import "./App.css";
import type { ChatType, MessageType } from "./types/types";

function App() {
  const [userId] = useState("123e4567-e89b-12d3-a456-426614174000");
  const [chats, setChats] = useState<ChatType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    const getChats = async () => {
      const res = await fetch(`http://localhost:5000/chats?userId=${userId}`);
      if (!res.ok) {
        console.error("Error fetching chats");
        return;
      }
      const data = await res.json();
      setChats(data);
    };

    getChats();
  }, [userId, currentChatId]);

  const createChat = () => {
    fetch("http://localhost:5000/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title: newChatTitle || "New chat" }),
    })
      .then((res) => res.json())
      .then((chat) => {
        setChats((prev) => [chat, ...prev]);
        setNewChatTitle("");
        setCurrentChatId(chat.id);
      })
      .catch((err) => console.error("Error creating chat:", err));
  };

  const sendMessage = (content: string) => {
    if (!currentChatId || !content.trim()) return;

    fetch(`http://localhost:5000/chats/${currentChatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "user", content }),
    })
      .then((res) => res.json())
      .then((message) => {
        setMessages((prev) => [...prev, message]);
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  useEffect(() => {
    if (!currentChatId) return;

    const getMessages = async () => {
      const res = await fetch(
        `http://localhost:5000/chats/${currentChatId}/messages`,
      );
      if (!res.ok) {
        console.error("Error fetching messages");
        return;
      }
      const data = await res.json();
      setMessages(data);
    };

    getMessages();
  }, [currentChatId]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
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
            <li
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              style={{
                padding: "6px",
                cursor: "pointer",
                fontWeight: currentChatId === chat.id ? "bold" : "normal",
              }}
            >
              {chat.title}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "12px", overflowY: "scroll" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: "8px",
                textAlign: msg.role === "user" ? "right" : "left",
                color: msg.role === "assistant" ? "#1a73e8" : "#333",
              }}
            >
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>
        <div style={{ padding: "8px", borderTop: "1px solid #ddd" }}>
          <input
            type="text"
            placeholder="Type a message..."
            style={{ width: "100%", padding: "10px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const input = e.currentTarget;
                sendMessage(input.value);
                input.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
