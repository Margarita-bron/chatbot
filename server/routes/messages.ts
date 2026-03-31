import { supabase } from "../db/db";
import { MessageType, LLMMessageType } from "../types";
import { askLLM } from "../llm/llm";

export async function createMessage(
  chatId: string | string[],
  role: "user" | "assistant",
  content: string,
): Promise<MessageType | null> {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, role, content }])
    .select("id, chat_id, role, content, created_at, updated_at")
    .single<MessageType>();

  if (error) {
    console.error("Error creating message:", error.message);
    return null;
  }

  return data;
}

export async function getMessagesByChatId(
  chatId: string | string[],
): Promise<MessageType[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, chat_id, role, content, created_at, updated_at")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages by chat ID:", error.message);
    return [];
  }

  return data;
}

export async function generateAssistantMessage(
  chatId: string | string[],
): Promise<MessageType | null> {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("chat_id", chatId)
    .order("created_at");

  if (error || !data) {
    console.error("Error fetching chat history:", error);
    return null;
  }

  const llmMessages: LLMMessageType[] = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    ...data.map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    })),
  ];

  const assistantContent = await askLLM(llmMessages);

  return await createMessage(chatId, "assistant", assistantContent);
}
