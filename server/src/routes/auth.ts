import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { signAuthToken } from "../lib/jwt.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const passwordMatches = await bcrypt.compare(parsed.data.password, user.hashedPassword);
  if (!passwordMatches) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signAuthToken({ userId: user.id });
  res.json({ token });
});
