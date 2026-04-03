import { useEffect, useState } from "react";
import type { ChatType, MessageType, UserType } from "../types/types";
import FileUploader from "../components/FileUploader";
import Nav from "../components/Nav";
import ChatUI from "../components/ChatUI";
import "../App.css";
import "../index.css";
import { ChatHeader } from "../components/ChatHeader";

function ChatBotScreen({ user }: { user: UserType }) {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const getChats = async () => {
      const res = await fetch(`http://localhost:5000/chats?userId=${user?.id}`);
      if (!res.ok) {
        console.error("Error fetching chats");
        return;
      }
      const data = await res.json();
      setChats(data);
    };

    getChats();
  }, [user?.id, currentChatId]);

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

  const createChat = async () => {
    console.log(user?.id);
    fetch(`http://localhost:5000/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id,
        title: newChatTitle || "New chat",
      }),
    })
      .then((res) => res.json())
      .then((chat) => {
        setChats((prev) => [chat, ...prev]);
        setNewChatTitle("");
        setCurrentChatId(chat.id);
      })
      .catch((err) => console.error("Error creating chat:", err));
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    let chatId = currentChatId;

    if (!chatId) {
      const response = await fetch(`http://localhost:5000/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          title: newChatTitle || "New chat",
        }),
      });

      if (!response.ok) {
        console.error(
          "Error creating chat:",
          response.status,
          response.statusText,
        );
        return;
      }

      const chat = await response.json();
      setChats((prev) => [chat, ...prev]);
      setNewChatTitle("");
      setCurrentChatId(chat.id);
      chatId = chat.id;
    }

    const res = await fetch(`http://localhost:5000/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "user", content }),
    });

    if (!res.ok) {
      console.error("Server error:", res.status, res.statusText);
      return;
    }

    const messages = await res.json();
    if (Array.isArray(messages)) {
      setMessages(messages);
    } else {
      setMessages([messages]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Nav
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        createChat={createChat}
        newChatTitle={newChatTitle}
        setNewChatTitle={setNewChatTitle}
      />
      <ChatUI messages={messages} sendMessage={sendMessage} />
      <FileUploader file={file} setFile={setFile} sendMessage={sendMessage} />
    </div>
  );
}

export default ChatBotScreen;
