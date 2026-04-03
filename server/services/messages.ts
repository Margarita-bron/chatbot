import { supabase } from "../supabase/supabase";
import { MessageType, LLMMessageType } from "../types";
import { askLLM } from "./llm";

export async function createMessage(
  chatId: string | string[],
  role: "user" | "assistant",
  content: string | null,
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
  console.log("createMessage", data);
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
  console.log("getMessagesByChatId", data);
  return data;
}

export async function generateAssistantMessage(
  chatId: string | string[],
  imageUrl?: string,
): Promise<string | null> {
  console.log("generateAssistantMessage chatId:", chatId);
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("chat_id", chatId)
    .order("created_at");

  if (error || !data) {
    console.error("Error fetching chat history:", error);
    return null;
  }
  const textMessages = data
    .filter(
      (msg) => typeof msg.content === "string" && msg.content.trim() !== "",
    )
    .slice(-5);
  const llmMessages: LLMMessageType[] = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    ...textMessages.map((msg) => ({
      role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
      content: msg.content,
    })),
  ];
  if (imageUrl) {
    llmMessages.push({
      role: "user" as const,
      content: `Analyze this image: ${imageUrl}`,
    });
  }
  const assistantContent = await askLLM(llmMessages);
  console.log("assistantContent", assistantContent);

  return assistantContent!;
}
