import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../lib/jwt.js";
import { AppError } from "../lib/errors.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    throw new AppError(401, "Unauthorized");
  }

  try {
    const payload = verifyAuthToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    throw new AppError(401, "Unauthorized");
  }
}
