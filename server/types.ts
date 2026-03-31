export type UserType = {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export type ChatType = {
  id: string;
  user_id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
};

export type MessageType = {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: Date;
  updated_at: string;
};

export type LLMMessageType = {
  role: "system" | "user" | "assistant";
  content: string;
};
