import { OpenAI } from "openai";
import { LLMMessageType } from "../types/types";

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function askLLM(prompt: LLMMessageType[]): Promise<string | null> {
  console.log("askLLM prompt", prompt);
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages: prompt,
    max_tokens: 2000,
  });
  console.log("askLLM messages completion:", completion);
  return completion.choices[0].message.content;
}
