"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
exports.askLLM = askLLM;
require("dotenv/config");
const openai_1 = __importDefault(require("openai"));
exports.openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function askLLM(messages) {
    const response = await exports.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error("OpenAI returned empty content");
    }
    return content;
}
