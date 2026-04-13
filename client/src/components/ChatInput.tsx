import { useState, useRef } from "react";
import { X, Paperclip, Send } from "lucide-react";
import { useToast } from "../context/ToastContext";

const MAX_FILE_SIZE_MB = 50;

export function ChatInput({
  sendMessage,
  disabled,
}: {
  sendMessage: (content: string, imageUrl?: string) => void;
  disabled: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [filePreview, setFilePreview] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleSend = () => {
    if (uploading) {
      console.log("Файл ещё загружается");
      return;
    }
    const trimmed = inputValue.trim();
    if (!trimmed && !filePreview) return;
    console.log(
      "sendMessage(trimmed, imagePreview ?? undefined);",
      filePreview,
    );
    sendMessage(trimmed || "", filePreview?.url ?? undefined);
    setInputValue("");
    setFilePreview(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("User state file: !token");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const { url, mimeType, size } = await res.json();

      if (
        size > MAX_FILE_SIZE_MB * 1024 &&
        /\.(pdf|docx|txt|xlsx)$/i.test(url)
      ) {
        showToast(
          {
            title: "File is too large (max 50KB)",
            description:
              "AI Chatbot currently doesn't support files larger than 2MB. Please reduce the size or select a smaller file.",
          },
          "info",
        );
        return;
      }

      setFilePreview({
        url: url,
        name: file.name,
        type: mimeType,
      });
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      setUploading(false);
    }

    e.target.value = "";
  };

  const removeImage = () => {
    setFilePreview(null);
  };

  //const isImage = filePreview?.type.startsWith("image/");
  const ext = filePreview?.name.split(".").pop()?.toLowerCase();
  const iconMap: Record<string, React.ReactNode> = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    ppt: "📊",
    pptx: "📊",
    xls: "📈",
    xlsx: "📈",
    zip: "📦",
    txt: "📄",
  };

  return (
    <div className="flex flex-col items-center border-be-transparent bg-white px-4 py-3">
      {filePreview && (
        <div className="mb-3 w-full max-w-2xl">
          <div className="relative h-24 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex items-center px-4 hover:shadow-md transition-all">
            {ext ? (
              <img
                src={filePreview.url}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-lg mr-4 flex-shrink-0"
              />
            ) : (
              <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow-inner">
                <span className="text-2xl">{iconMap[ext!] || "📎"}</span>
              </div>
            )}

            <div className="flex-1 min-w-0 pr-12">
              <p className="font-medium text-sm text-gray-900 truncate">
                {filePreview.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {String(filePreview.type).split("/")[1] || "file"}
              </p>
            </div>

            <button
              onClick={removeImage}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-gray-900/70 flex items-center justify-center"
            >
              <X className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden relative"
      />

      <div className="flex w-full mb-1 gap-3 justify-between max-w-3xl mx-auto ">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Attach images,files"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"Type a message…"}
          disabled={disabled}
          rows={1}
          className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                       disabled:opacity-50 overflow-y-hidden"
        />

        <button
          onClick={handleSend}
          disabled={disabled || (!inputValue.trim() && !filePreview)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-xs text-gray-500 mt-2 max-w-3xl mx-auto">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
