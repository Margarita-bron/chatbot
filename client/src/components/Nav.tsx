import type { ChatType } from "../types/types";

type Props = {
  chats: ChatType[];
  currentChatId: string | null;
  setCurrentChatId: (id: string) => void;
  createChat: () => void;
  newChatTitle: string;
  setNewChatTitle: (title: string) => void;
};

function Nav({
  chats,
  currentChatId,
  setCurrentChatId,
  createChat,
  newChatTitle,
  setNewChatTitle,
}: Props) {
  console.log(chats, currentChatId);
  return (
    <aside className=" h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-yellow-400 text-white flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6M1 12h6M12 23v-6M23 12h-6" />
        </svg>
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>

      <div className="p-4 space-y-3">
        <input
          type="text"
          value={newChatTitle}
          onChange={(e) => setNewChatTitle(e.target.value)}
          placeholder="Название чата"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        />
        <button
          onClick={createChat}
          className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors"
        >
          + Новый чат
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-1">
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`text-sm px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                currentChatId === chat.id
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {chat.title}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Nav;
