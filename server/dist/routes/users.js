"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUserById = getUserById;
const db_1 = require("../db/db");
async function createUser(email) {
    const { data, error } = await db_1.supabase
        .from("users")
        .insert([{ email }])
        .select("id, email, created_at, updated_at")
        .single();
    if (error) {
        console.error("Error creating user:", error.message);
        return null;
    }
    return data;
}
async function getUserById(userId) {
    const { data, error } = await db_1.supabase
        .from("users")
        .select("id, email, created_at, updated_at")
        .eq("id", userId)
        .single();
    if (error) {
        console.error("Error fetching user by ID:", error.message);
        return null;
    }
    return data;
}
