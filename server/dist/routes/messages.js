"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = createMessage;
exports.getMessagesByChatId = getMessagesByChatId;
exports.generateAssistantMessage = generateAssistantMessage;
const db_1 = require("../db/db");
const llm_1 = require("../llm/llm");
async function createMessage(chatId, role, content) {
    const { data, error } = await db_1.supabase
        .from("messages")
        .insert([{ chat_id: chatId, role, content }])
        .select("id, chat_id, role, content, created_at, updated_at")
        .single();
    if (error) {
        console.error("Error creating message:", error.message);
        return null;
    }
    return data;
}
async function getMessagesByChatId(chatId) {
    const { data, error } = await db_1.supabase
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
async function generateAssistantMessage(chatId) {
    const { data, error } = await db_1.supabase
        .from("messages")
        .select("role, content")
        .eq("chat_id", chatId)
        .order("created_at");
    if (error || !data) {
        console.error("Error fetching chat history:", error);
        return null;
    }
    const llmMessages = [
        {
            role: "system",
            content: "You are a helpful assistant.",
        },
        ...data.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
        })),
    ];
    const assistantContent = await (0, llm_1.askLLM)(llmMessages);
    return await createMessage(chatId, "assistant", assistantContent);
}
