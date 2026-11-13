import { Router } from "express";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { orders } from "../db/schema.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../lib/errors.js";
import { TERM_YEARS, getYieldCurve } from "../services/treasury.js";

export const ordersRouter = Router();

const TERMS = Object.keys(TERM_YEARS) as [string, ...string[]];

const createOrderSchema = z.object({
  term: z.enum(TERMS),
  amount: z
    .string()
    .regex(
      /^\d{1,16}(\.\d{1,2})?$/,
      "Amount must be a decimal string with up to 16 digits and 2 decimal places",
    )
    .refine((value) => Number(value) > 0, "Amount must be greater than 0"),
  side: z.enum(["buy", "sell"]),
  idempotencyKey: z.string().min(1).max(255),
});

const listQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === "23505";
}

ordersRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Invalid request", parsed.error.flatten().fieldErrors);
    }

    const userId = req.userId!;
    const { term, amount, side, idempotencyKey } = parsed.data;

    const curve = await getYieldCurve();
    const point = curve.points.find((p) => p.term === term);
    if (!point) {
      throw new AppError(502, "Unable to determine current yield for term");
    }

    try {
      const [order] = await db
        .insert(orders)
        .values({ userId, term, amount, side, yieldPercent: point.yieldPercent.toFixed(3), idempotencyKey })
        .returning();
      res.status(201).json(order);
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;

      const [existing] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.userId, userId), eq(orders.idempotencyKey, idempotencyKey)))
        .limit(1);
      if (!existing) throw err;
      res.status(200).json(existing);
    }
  }),
);

ordersRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError(400, "Invalid query parameters", parsed.error.flatten().fieldErrors);
    }

    const limit = parsed.data.limit ?? 20;
    const offset = parsed.data.offset ?? 0;

    const page = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt), desc(orders.id))
      .limit(limit)
      .offset(offset);

    res.json({ orders: page });
  }),
);
