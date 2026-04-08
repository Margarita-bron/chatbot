import { OpenAI } from "openai";
import { LLMMessageType } from "../types/types";

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function askLLM(
  prompt: LLMMessageType[],
  imageUrl?: string,
): Promise<string | null> {
  const messages = prompt.map((msg) => ({
    role: msg.role,
    content:
      typeof msg.content === "string"
        ? msg.content
        : Array.isArray(msg.content)
          ? JSON.stringify(msg.content)
          : "Invalid message content",
  }));

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages,
    max_tokens: 2000,
  });
  console.log("askLLM messages completion:", completion);
  return completion.choices[0].message.content;
}
