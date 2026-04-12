import express from "express";
import { registerUser, loginUser, logoutUser, getUser } from "../services/auth";
import { authMiddleware } from "../services/middleware";
import { getUserById } from "../services/users";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const { data, error } = await registerUser(email, password);

  if (error || !data?.session?.access_token) {
    return res
      .status(400)
      .json({ error: error?.message || "Registration failed" });
  }

  res.status(201).json({
    user: data.user,
    accessToken: data.session.access_token,
    // refreshToken: data.session.refresh_token, // можно тоже вернуть
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const { data, error } = await loginUser(email, password);

  if (error || !data?.session?.access_token) {
    return res.status(401).json({ error: error?.message });
  }
  console.log("errrrrrrrrrrr", data.user);
  res.json({
    user: data.user,
    accessToken: data.session.access_token,
  });
});

router.post("/logout", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(400).json({ error: "Access token required" });

  const token = authHeader.split(" ")[1];

  const { error } = await logoutUser(token);
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Logged out" });
});

router.get("/me", async (req, res) => {
  console.log("ME ROUTE HIT", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  const { data, error } = await getUser(token);
  if (error || !data) return res.status(401).json({ error: error?.message });
  console.log('r.get("/me"', data);
  res.json(data);
});

export default router;
