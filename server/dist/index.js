"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const users_1 = require("./routes/users");
const chats_1 = require("./routes/chats");
const messages_1 = require("./routes/messages");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.post("/users", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "email is required" });
    }
    try {
        const user = await (0, users_1.createUser)(email);
        res.status(201).json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Error creating user" });
    }
});
app.get("/chats", async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "userId is required" });
    }
    try {
        const chats = await (0, chats_1.getChatsByUserId)(userId);
        res.status(200).json(chats);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching chats" });
    }
});
app.post("/chats", async (req, res) => {
    const { userId, title } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }
    const chatTitle = title || "New chat";
    try {
        const chat = await (0, chats_1.createChat)(userId, chatTitle);
        res.status(201).json(chat);
    }
    catch (err) {
        res.status(500).json({ message: "Error creating chat" });
    }
});
app.get("/chats/:id/messages", async (req, res) => {
    const chatId = req.params.id;
    try {
        const messages = await (0, messages_1.getMessagesByChatId)(chatId);
        res.status(200).json(messages ?? []);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching messages" });
    }
});
app.post("/chats/:id/messages", async (req, res) => {
    const chatId = req.params.id;
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({ message: "content is required" });
    }
    const role = body.role ?? "user";
    const content = body.content;
    try {
        const userMessage = await (0, messages_1.createMessage)(chatId, role, content);
        if (!userMessage) {
            return res.status(500).json({ message: "Error creating user message" });
        }
        const assistantMessage = await (0, messages_1.generateAssistantMessage)(chatId);
        if (!assistantMessage) {
            return res
                .status(500)
                .json({ message: "Error generating assistant message" });
        }
        const messages = await (0, messages_1.getMessagesByChatId)(chatId);
        res.status(200).json(messages);
    }
    catch (err) {
        console.error("Error in /chats/:id/messages POST:", err);
        res.status(500).json({ message: "Error creating message" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
