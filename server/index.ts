import "dotenv/config";
import express, { Request, Response } from "express";
import client from "./db/db";
import * as queries from "./db/queries";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/users", async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  try {
    const user = await queries.createUser(client, email);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
});

app.get("/chats", async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const chats = await queries.getChatsByUserId(client, userId);
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats" });
  }
});

app.post("/chats", async (req: Request, res: Response) => {
  const { userId, title } = req.body as { userId?: string; title?: string };

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  const chatTitle = title || "New chat";

  try {
    const chat = await queries.createChat(client, userId, chatTitle);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error creating chat" });
  }
});

app.get("/chats/:id/messages", async (req: Request, res: Response) => {
  const chatId = req.params.id;

  try {
    const messages = await queries.getMessagesByChatId(client, chatId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.post("/chats/:id/messages", async (req: Request, res: Response) => {
  const chatId = req.params.id;
  const body = req.body as { role: "user" | "assistant"; content: string };

  const role = body.role || "user";
  const content = body.content;

  if (!content) {
    return res.status(400).json({ message: "content is required" });
  }

  try {
    const message = await queries.createMessage(client, chatId, role, content);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Error creating message" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
