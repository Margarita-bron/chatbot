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

export type LLMMessageType =
  | {
      role: "system" | "assistant";
      content: string;
    }
  | {
      role: "user";
      content:
        | string
        | Array<
            | { type: "text"; text: string }
            | { type: "image_url"; image_url: { url: string } }
          >;
    };

export type MessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_url: string | null;
  created_at: string;
};
