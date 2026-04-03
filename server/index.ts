import "dotenv/config";
import cors from "cors";
import express, { Request, Response } from "express";
import { createUser } from "./services/users";
import { getChatsByUserId, createChat } from "./services/chats";
import {
  getMessagesByChatId,
  createMessage,
  generateAssistantMessage,
} from "./services/messages";
import cookieParser from "cookie-parser";
import auth from "./routes/auth";
import fileRouter from "./routes/files";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/auth", auth);
app.use("/files", fileRouter);

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
  const id = req.params.id;
  const { role, content, imageUrl } = req.body;
  const userMsg = await createMessage(id, role as "user", content);

  if (!userMsg) {
    return res.status(400).json({ error: "Unable to create user message" });
  }

  const assistantContent = await generateAssistantMessage(id, imageUrl);

  const assistantMsg = await createMessage(id, "assistant", assistantContent);

  if (!assistantMsg) {
    console.error("Error saving assistant message");
  }

  const messages = await getMessagesByChatId(id);
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
