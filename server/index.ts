import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/chats", (req: Request, res: Response) => {
  res.json([
    { id: "chat-1", title: "First chat" },
    { id: "chat-2", title: "Another chat" },
  ]);
});

app.post("/api/chats", (req: Request, res: Response) => {
  const body = req.body as { title?: string };

  const id = `chat-${Date.now()}`;
  const title = body.title || "New chat";

  res.status(201).json({ id, title });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("API docs:");
  console.log("  GET  /api/health");
  console.log("  GET  /api/chats");
  console.log("  POST /api/chats");
});
