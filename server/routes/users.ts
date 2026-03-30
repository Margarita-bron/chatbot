import { UserType } from "../db/types";
import { supabase } from "../db/db";

export async function createUser(email: string): Promise<UserType | null> {
  const { data, error } = await supabase
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

export async function getUserById(userId: string): Promise<UserType | null> {
  const { data, error } = await supabase
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
