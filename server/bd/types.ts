export type User = {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export type Chat = {
  id: string;
  user_id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
};

export type Message = {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: Date;
};
