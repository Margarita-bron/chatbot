import { supabase } from "../db/db";
import { MessageType } from "../db/types";

export async function createMessage(
  chatId: string | string[],
  role: "user" | "assistant",
  content: string,
): Promise<MessageType | null> {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, role, content }])
    .select("id, chat_id, role, content, created_at")
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
    .select("id, chat_id, role, content, created_at")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages by chat ID:", error.message);
    return [];
  }

  return data;
}
