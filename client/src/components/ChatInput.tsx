import { useState, useRef } from "react";
import { API_BASE } from "../App";

export function ChatInput({
  sendMessage,
  disabled,
}: {
  sendMessage: (content: string, imageUrl?: string) => void;
  disabled: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed && !imagePreview) return;

    sendMessage(trimmed, imagePreview ?? undefined);
    setInputValue("");
    setImagePreview(null);
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
    if (!file || !file.type.startsWith("image/")) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    formData.append("contentType", file.type);

    try {
      const res = await fetch(`${API_BASE}/api/files/upload`, {
        method: "POST",
        body: formData,
      });
      const { url } = await res.json();
      setImagePreview(url);
    } catch (err) {
      console.error("Image upload error:", err);
    }

    // reset input
    e.target.value = "";
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      {/* Image preview (если есть) */}
      {imagePreview && (
        <div className="mb-2 flex max-w-3xl mx-auto">
          <div className="relative h-16 w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={imagePreview}
              alt="Uploaded image"
              className="h-full w-full object-cover rounded-lg"
            />
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
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        {/* Кнопка прикрепления изображения */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Attach image"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* TextArea */}
        <div className="flex-1 relative">
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
                       disabled:opacity-50"
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!inputValue.trim() && !imagePreview)}
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
