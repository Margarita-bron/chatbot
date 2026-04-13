import { supabase } from "../supabase/supabase";
import { MessageType, LLMMessageType, ImageTypes } from "../types/types";
import { askLLM } from "./llm";
import mammoth from "mammoth";

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
  const lastUserMessage = [...data].reverse().find((m) => m.role === "user");
  const isImage = (url?: string | null) =>
    !!url && /\.(jpg|jpeg|png|webp|gif)$/i.test(url);

  const isDoc = (url?: string | null) =>
    !!url && /\.(pdf|docx|txt|xlsx)$/i.test(url);

  const processedMessages = await Promise.all(
    data.map(async (msg) => {
      const url = msg.image_url;

      if (isDoc(url)) {
        const res = await fetch(url!);
        const buffer = await res.arrayBuffer();

        const result = await mammoth.extractRawText({
          buffer: Buffer.from(buffer),
        });
        console.log(result.value);
        return {
          role: msg.role,
          content: `${msg.content || ""}\n\n${result.value}`,
        };
      }

      if (isImage(url)) {
        return {
          role: msg.role,
          content: [
            { type: "text", text: msg.content || "" },
            { type: "image_url", image_url: { url } },
          ],
        };
      }

      return {
        role: msg.role,
        content: msg.content || "",
      };
    }),
  );

  const llmMessages = [
    { role: "system", content: "You are a helpful assistant." },
    ...processedMessages,
  ];

  console.log(
    "generateAssistantMessage llmMessages",
    JSON.stringify(llmMessages),
  );
  const assistantContent = await askLLM(llmMessages);

  return assistantContent!;
}
