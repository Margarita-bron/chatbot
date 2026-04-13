import { OpenAI } from "openai";
import { LLMMessageType } from "../types/types";

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});
//openai/gpt-5.3-chat  openai/gpt-5.3-codex text img
export async function askLLM(
  prompt: LLMMessageType[],
  model: string = "gpt-4o-mini",
): Promise<string | null> {
  console.log(model);
  const completion = await openai.chat.completions.create({
    model,
    messages: prompt,
    max_tokens: 2000,
  });
  console.log("askLLM messages completion:", completion);
  return completion.choices[0].message.content;
}
