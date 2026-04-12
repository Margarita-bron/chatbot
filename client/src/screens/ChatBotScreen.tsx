import { useEffect, useState } from "react";
import type { ChatType, MessageType } from "../types/types";
import Nav from "../components/Nav";
import ChatUI from "../components/ChatUI";
import "../App.css";
import "../index.css";
import { ChatInput } from "../components/ChatInput";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function ChatBotScreen() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const getChats = async () => {
      if (!user?.id || authLoading) return;
      setLoading(true);
      console.log("getChats", localStorage.getItem("accessToken"));
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/chats`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!res.ok) throw new Error("Error fetching chats");

        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getChats();
  }, [user?.id, authLoading]);

  useEffect(() => {
    console.log("ChatBotScreen", user);
    if (!currentChatId) return;

    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/chats/${currentChatId}/messages`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );
        if (!res.ok) throw new Error("Error fetching messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [currentChatId]);

  const createChat = async () => {
    if (!user?.id) return;
    console.log("createChat data:", { userId: user?.id, title: newChatTitle });
    fetch(`${import.meta.env.VITE_API_BASE}/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        title: newChatTitle || "New chat",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            console.error("Error creating chat:", res.status, err);
            throw new Error(err.message || "Failed to create chat");
          });
        }
        return res.json();
      })
      .then((chat) => {
        console.log(user?.id);
        setChats((prev) => [chat, ...prev]);
        setNewChatTitle("");
        setCurrentChatId(chat.id);
      })
      .catch((err) => console.error("Error creating chat:", err));
  };

  const sendMessage = async (content: string, imageUrl?: string) => {
    if (!user?.id) return;
    if (!content.trim() && !imageUrl) return;

    setLoading(true);

    try {
      let chatId = currentChatId;

      if (!chatId) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/chats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ title: newChatTitle || "New chat" }),
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Error creating chat:", errData);
          setLoading(false);
          return;
        }

        const newChat = await res.json();
        setChats((prev) => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        chatId = newChat.id;
        setNewChatTitle("");
      }
      console.log("SEND MESSAGE BODY:", { role: "user", content, imageUrl });
      const resMsg = await fetch(
        `${import.meta.env.VITE_API_BASE}/chats/${chatId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },

          body: JSON.stringify({ role: "user", content, imageUrl }),
        },
      );

      if (!resMsg.ok) {
        console.error("Error sending message:", await resMsg.text());
        setLoading(false);
        return;
      }

      const messagesData = await resMsg.json();
      setMessages(Array.isArray(messagesData) ? messagesData : [messagesData]);
    } catch (err) {
      console.error("sendMessage error:", err);
    } finally {
      setLoading(false);
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
      <div className="flex flex-col w-full">
        <ChatUI messages={messages} />
        <ChatInput sendMessage={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}

export default ChatBotScreen;
