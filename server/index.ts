import "dotenv/config";
import cors from "cors";
import express, { Request, Response } from "express";
import { createUser } from "./routes/users";
import { getChatsByUserId, createChat } from "./routes/chats";
import { getMessagesByChatId, createMessage } from "./routes/messages";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.post("/users", async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  try {
    const user = await createUser(email);
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
    const chats = await getChatsByUserId(userId);
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
    const chat = await createChat(userId, chatTitle);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error creating chat" });
  }
});

app.get("/chats/:id/messages", async (req: Request, res: Response) => {
  const chatId = req.params.id;

  try {
    const messages = await getMessagesByChatId(chatId);
    res.status(200).json(messages ?? []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.post("/chats/:id/messages", async (req: Request, res: Response) => {
  const chatId = req.params.id;
  const body = req.body as { role?: "user" | "assistant"; content?: string };

  if (!body.content) {
    return res.status(400).json({ message: "content is required" });
  }

  const role: "user" | "assistant" = body.role ?? "user";
  const content = body.content;

  try {
    const message = await createMessage(chatId, role, content);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Error creating message" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
