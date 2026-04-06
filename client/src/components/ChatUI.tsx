import type { MessageType } from "../types/types";

type Props = {
  messages: MessageType[];
};

function ChatUI({ messages }: Props) {
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
    </div>
  );
}

export default ChatUI;
