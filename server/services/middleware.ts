import { Request, Response, NextFunction } from "express";
import { getUser } from "./auth";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  console.log("MIDDLEWARE HIT", req.method, req.path);
  console.log("req.headers.authorization", req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("❌ No Authorization header");
    return res.status(401).json({ error: "No token" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("❌ Invalid Authorization format");
    return res.status(401).json({ error: "Invalid token format" });
  }

  const token = parts[1];

  if (!token) {
    console.log("❌ No token in header");
    return res.status(401).json({ error: "No token in header" });
  }

  const { data, error } = await getUser(token);

  console.log("authMiddleware data:", data);
  console.log("authMiddleware error:", error);

  if (error || !data) {
    console.log("❌ Invalid token");
    return res.status(401).json({ error: "Invalid token" });
  }

  (req as any).userId = data.id;
  next();
};
