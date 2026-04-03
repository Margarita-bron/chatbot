import React from "react";

type Props = {
  title: string;
};

export const ChatHeader: React.FC<Props> = ({ title }) => {
  return (
    <div className="flex flex-1 items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <h2 className="font-semibold text-gray-800 text-base">{title}</h2>
      <button
        className="text-gray-500 hover:text-gray-700 text-sm"
        aria-label="Настройки чата"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>
    </div>
  );
};
