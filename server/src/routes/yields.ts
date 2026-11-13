import { Router } from "express";
import { getYieldCurve } from "../services/treasury.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { AppError } from "../lib/errors.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const yieldsRouter = Router();

yieldsRouter.get(
  "/curve",
  requireAuth,
  asyncHandler(async (_req, res) => {
    let curve;
    try {
      curve = await getYieldCurve();
    } catch (err) {
      console.error("Failed to load yield curve", err);
      throw new AppError(502, "Unable to fetch treasury yield curve");
    }
    res.json(curve);
  }),
);
