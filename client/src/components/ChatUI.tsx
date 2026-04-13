import type { MessageType } from "../types/types";
import { Sparkles } from "lucide-react";

type Props = {
  messages: MessageType[];
};

function ChatUI({ messages }: Props) {
  return (
    <div className="flex relative flex-col w-full h-full overflow-hidden flex-1 bg-white border-r border-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 mx-auto w-full custom-scrollbar scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="text-center max-w-md animate-fade-in-up">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary fill-amber-300 stroke-amber-950" />
              </div>
              <h1 className="!text-blue-700 text-2xl font-bold mb-2">
                AI Chatbot
              </h1>
              <p className="text-muted-foreground mb-8">
                Your intelligent assistant. Ask anything, upload images, docs
                and get instant answers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left"></div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex flex-col h-full max-w-[80%] px-4 py-2.5 text-sm rounded-2xl leading-relaxed break-words overflow-wrap-anywhere word-break-break-all [overflow-wrap:anywhere] items-start ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    alt="image"
                    className="h-full w-50 object-cover rounded-lg"
                  />
                )}

                <div
                  className="w-full prose prose-sm max-w-none text-start break-words [word-break:break-all] [overflow-wrap:anywhere] [&_strong]:inline [&_strong]:font-semibold [&_em]:italic"
                  dangerouslySetInnerHTML={{
                    __html: `<p>${msg.content
                      .replace(/\n/g, "</p><p>")
                      .replace(/<\/p><p>/g, "<br>")}</p>`.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>".replace(
                        /\*(.*?)\*/g,
                        "<em>$1</em>",
                      ),
                    ),
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatUI;
