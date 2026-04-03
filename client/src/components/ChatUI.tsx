import { useState } from "react";
import type { MessageType } from "../types/types";

type Props = {
  messages: MessageType[];
  sendMessage: (content: string, imageUrl?: string) => void;
};

function ChatUI({ messages, sendMessage }: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-white border-r border-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-gray-500 mt-12">
            Напишите сообщение боту…
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 text-sm rounded-2xl leading-snug ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите сообщение…"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatUI;
