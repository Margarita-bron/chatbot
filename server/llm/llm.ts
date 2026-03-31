import "dotenv/config";
import OpenAI from "openai";
import type { LLMMessageType } from "../types";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askLLM(messages: LLMMessageType[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned empty content");
  }

  return content;
}
