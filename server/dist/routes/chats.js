"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChat = createChat;
exports.getChatsByUserId = getChatsByUserId;
exports.getChatById = getChatById;
const db_1 = require("../db/db");
async function createChat(userId, title) {
    const { data, error } = await db_1.supabase
        .from("chats")
        .insert([{ user_id: userId, title }])
        .select("id, user_id, title, created_at, updated_at")
        .single();
    if (error) {
        console.error("Error creating chat:", error.message);
        return null;
    }
    return data;
}
async function getChatsByUserId(userId) {
    const { data, error } = await db_1.supabase
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
async function getChatById(chatId) {
    const { data, error } = await db_1.supabase
        .from("chats")
        .select("id, user_id, title, created_at, updated_at")
        .eq("id", chatId)
        .single();
    if (error) {
        console.error("Error fetching chat by ID:", error.message);
        return null;
    }
    return data;
}
