import { Router } from "express";
import { getYieldCurve } from "../services/treasury.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const yieldsRouter = Router();

yieldsRouter.get("/curve", requireAuth, async (_req, res) => {
  try {
    const curve = await getYieldCurve();
    res.json(curve);
  } catch (err) {
    console.error("Failed to load yield curve", err);
    res.status(502).json({ error: "Unable to fetch treasury yield curve" });
  }
});
