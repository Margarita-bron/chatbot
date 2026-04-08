import { Request, Response, NextFunction } from "express";
import { supabase } from "../supabase/supabase";
import cookieParser from "cookie-parser";

export async function registerUser(
  email: string,
  password: string,
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function getUser(
  accessToken: string,
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.auth.getUser(accessToken);
  console.log("getUser", data);
  return { data: data.user, error };
}

export async function logoutUser(accessToken: string): Promise<{ error: any }> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error };
  }

  return { error: null };
}
