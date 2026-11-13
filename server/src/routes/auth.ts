import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { signAuthToken } from "../lib/jwt.js";
import { AppError } from "../lib/errors.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Invalid request");
    }

    const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(parsed.data.password, user.hashedPassword);
    if (!passwordMatches) {
      throw new AppError(401, "Invalid email or password");
    }

    const token = signAuthToken({ userId: user.id });
    res.json({ token });
  }),
);
