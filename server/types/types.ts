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

export type LLMMessageType = {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: "image_url"; image_url: { url: string } }>;
};

export type MessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};
