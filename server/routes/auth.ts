import express from "express";
import { registerUser, loginUser, logoutUser, getUser } from "../services/auth";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const { user, error } = await registerUser(email, password);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const { user, error } = await loginUser(email, password);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ user });
});

router.post("/logout", async (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token required" });
  }

  const { error } = await logoutUser(accessToken);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Logged out" });
});

export default router;

router.get("/me", async (req, res) => {
  const accessToken = req.cookies.accessToken;
  console.log("Access Token:", accessToken);

  const MOCK_USER = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    email: "mock.user@example.com",
    aud: "authenticated",
    role: "user",
  };

  /*if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await getUser(accessToken);

  if (error) {
    return res.status(401).json({ error: error.message });
  }*/

  //res.json(data.user);
  res.json(MOCK_USER);
});

router.post("/set-cookie", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token required" });
  }
  console.log("Setting cookie with access token:", accessToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({ success: true });
});
