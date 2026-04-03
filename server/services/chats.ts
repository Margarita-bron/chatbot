import { supabase } from "../supabase/supabase";
import { ChatType } from "../types";

export async function createChat(
  userId: string,
  title: string | undefined,
): Promise<ChatType | null> {
  const { data, error } = await supabase
    .from("chats")
    .insert([{ user_id: userId, title }])
    .select("id, user_id, title, created_at, updated_at")
    .single<ChatType>();

  if (error) {
    console.error("Error creating chat:", error.message);
    return null;
  }

  return data;
}

export async function getChatsByUserId(userId: string): Promise<ChatType[]> {
  const { data, error } = await supabase
    .from("chats")
    .select("id, user_id, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching chats:", error.message);
    return [];
  }

  return data;
}

export async function getChatById(
  chatId: string | string[],
): Promise<ChatType | null> {
  const { data, error } = await supabase
    .from("chats")
    .select("id, user_id, title, created_at, updated_at")
    .eq("id", chatId)
    .single<ChatType>();

  if (error) {
    console.error("Error fetching chat by ID:", error.message);
    return null;
  }

  return data;
}
