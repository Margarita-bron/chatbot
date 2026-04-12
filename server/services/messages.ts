import { supabase } from "../supabase/supabase";
import { MessageType, LLMMessageType } from "../types/types";
import { askLLM } from "./llm";

export async function createMessage(
  chatId: string | string[],
  role: "user" | "assistant",
  content: string | null,
  imageUrl?: string | null,
): Promise<MessageType | null> {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, role, content, image_url: imageUrl }])
    .select("id, chat_id, role, content, image_url, created_at, updated_at")
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
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages by chat ID:", error.message);
    return [];
  }
  console.log("getMessagesByChatId", data, data[0].image_url);
  return data;
}

export async function generateAssistantMessage(
  chatId: string | string[],
): Promise<string | null> {
  console.log("generateAssistantMessage chatId:", chatId);
  const { data, error } = await supabase
    .from("messages")
    .select("role, content,image_url")
    .eq("chat_id", chatId)
    .order("created_at");

  if (error || !data) {
    console.error("Error fetching chat history:", error);
    return null;
  }
  const lastMessages = data.slice(-6);
  const llmMessages: LLMMessageType[] = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    ...lastMessages.map((msg) => {
      console.log("generateAssistantMessage llmMessages", msg.image_url);
      if (msg.image_url) {
        return {
          role: msg.role as "user" | "assistant",
          content: [
            { type: "text", text: msg.content || "" },
            { type: "image_url", image_url: { url: msg.image_url } },
          ],
        };
      }

      return {
        role: msg.role as "user" | "assistant",
        content: msg.content || "",
      };
    }),
  ];
  console.log("generateAssistantMessage llmMessages", llmMessages);
  const assistantContent = await askLLM(llmMessages);

  return assistantContent!;
}
