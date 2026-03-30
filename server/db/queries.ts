import { Client, QueryResult } from "pg";
import { ChatType, MessageType, UserType } from "./types";

export async function createUser(
  client: Client,
  email: string,
): Promise<UserType> {
  const result = await client.query(
    "INSERT INTO users (email) VALUES ($1) RETURNING id,email,created_at.updated_at",
    [email],
  );
  return result.rows[0];
}

export async function getUserById(
  client: Client,
  userId: string,
): Promise<UserType | null> {
  const result = await client.query(
    "SELECT id, email, created_at, updated_at FROM users WHERE id = $1",
    [userId],
  );

  return result.rows[0] ?? null;
}
export async function createChat(
  client: Client,
  userId: string,
  title: string,
): Promise<ChatType> {
  const result = await client.query(
    "INSERT INTO chats (user_id, title) VALUES ($1, $2) RETURNING id, user_id, title, created_at, updated_at",
    [userId, title],
  );

  return result.rows[0];
}

export async function getChatsByUserId(
  client: Client,
  userId: string,
): Promise<ChatType[]> {
  const result = await client.query(
    "SELECT id, user_id, title, created_at, updated_at FROM chats WHERE user_id = $1 ORDER BY created_at DESC",
    [userId],
  );

  return result.rows;
}

export async function getChatById(
  client: Client,
  chatId: string,
): Promise<ChatType | null> {
  const result = await client.query(
    "SELECT id, user_id, title, created_at, updated_at FROM chats WHERE id = $1",
    [chatId],
  );

  return result.rows[0] ?? null;
}

export async function createMessage(
  client: Client,
  chatId: string | string[],
  role: "user" | "assistant",
  content: string,
): Promise<MessageType> {
  const result = await client.query(
    "INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3) RETURNING id, chat_id, role, content, created_at",
    [chatId, role, content],
  );

  return result.rows[0];
}

export async function getMessagesByChatId(
  client: Client,
  chatId: string | string[],
): Promise<MessageType[]> {
  const result = await client.query(
    "SELECT id, chat_id, role, content, created_at FROM messages WHERE chat_id = $1 ORDER BY created_at",
    [chatId],
  );

  return result.rows;
}
