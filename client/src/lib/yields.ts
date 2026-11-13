import type { YieldCurve } from "shared";
import { authFetch } from "./api";

export function getYieldCurve(): Promise<YieldCurve> {
  return authFetch<YieldCurve>("/api/yields/curve");
}
