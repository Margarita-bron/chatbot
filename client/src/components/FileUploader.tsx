import { useRef } from "react";

type Props = {
  file: File | null;
  setFile: (file: File | null) => void;
  sendMessage: (content: string, imageUrl?: string) => void;
};

function FileUploader({ file, setFile, sendMessage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", file.name);
    formData.append("contentType", file.type);

    const res = await fetch("${API_BASE}/api/files/upload", {
      method: "POST",
      body: formData,
    });

    const { url } = await res.json();
    sendMessage("", url);
  };

  return (
    <aside className="w-70 h-full bg-white border-l border-gray-200 p-4 flex flex-col shadow-sm">
      <div className="text-sm text-gray-600 mb-2">Вложения</div>
      <button
        onClick={() => inputRef.current?.click()}
        className="flex-1 flex flex-col items-center justify-center space-y-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <span className="text-xl">🖼️</span>
        <span>Прикрепить изображение</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFile(file);
            uploadFile();
          }
        }}
      />
    </aside>
  );
}

export default FileUploader;
