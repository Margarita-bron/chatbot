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
import uploadRouter from "./routes/files";
import { authMiddleware } from "./services/middleware";

const allowedOrigins = ["http://localhost:5173", /^http:\/\/localhost:\d+$/];

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowed = allowedOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin),
      );
      if (allowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/auth", auth);
app.use(authMiddleware);
app.use("/files", uploadRouter);

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
  const userId = (req as any).userId;
  console.log("/chats  userId", userId);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const chats = await getChatsByUserId(userId);
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats" });
  }
});

app.post("/chats", async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  console.log("Received /chats:", req.body, userId);

  const { title } = req.body as { title?: string };

  if (!userId) {
    console.log("❌ NO USER ID");
    return res.status(401).json({ message: "Unauthorized" });
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
  const userId = (req as any).userId!;
  const { role, content, imageUrl } = req.body;

  console.log("/chats/:id/messages", role, content, imageUrl);
  const userMsg = await createMessage(id, role as "user", content, imageUrl);

  if (!userMsg) {
    return res.status(400).json({ error: "Unable to create user message" });
  }

  const assistantContent = await generateAssistantMessage(id);

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
