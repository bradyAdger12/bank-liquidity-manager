import { cacheGet, cacheSet } from "../lib/redis.js";
import type { YieldPoint, YieldCurve } from "shared";

const TREASURY_CSV_URL =
  "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/{year}/all?type=daily_treasury_yield_curve&field_tdr_date_value={year}&page&_format=csv";

const CACHE_KEY = "treasury:yield-curve:latest";

export const TERM_YEARS: Record<string, number> = {
  "1 Mo": 1 / 12,
  "1.5 Month": 1.5 / 12,
  "2 Mo": 2 / 12,
  "3 Mo": 3 / 12,
  "4 Mo": 4 / 12,
  "6 Mo": 6 / 12,
  "1 Yr": 1,
  "2 Yr": 2,
  "3 Yr": 3,
  "5 Yr": 5,
  "7 Yr": 7,
  "10 Yr": 10,
  "20 Yr": 20,
  "30 Yr": 30,
};

function parseCsv(csv: string): string[][] {
  return csv
    .trim()
    .split("\n")
    .map((line) => line.split(",").map((cell) => cell.replace(/^"|"$/g, "").trim()));
}

function parseLatestRow(csv: string): YieldCurve {
  const [header, ...rows] = parseCsv(csv);
  if (!header || rows.length === 0) {
    throw new Error("Treasury CSV response was empty");
  }
  const latest = rows[0];
  if (!latest) {
    throw new Error("Treasury CSV response had no data rows");
  }

  const points: YieldPoint[] = [];
  for (let i = 1; i < header.length; i++) {
    const term = header[i];
    const raw = latest[i];
    if (!term || !(term in TERM_YEARS) || !raw) continue;
    const yieldPercent = Number(raw);
    if (Number.isNaN(yieldPercent)) continue;
    points.push({ term, years: TERM_YEARS[term]!, yieldPercent });
  }
  points.sort((a, b) => a.years - b.years);

  return { date: latest[0] ?? "unknown", points };
}

export async function getYieldCurve(): Promise<YieldCurve> {
  const cached = await cacheGet<YieldCurve>(CACHE_KEY);
  if (cached) {
    return cached;
  }

  const year = new Date().getFullYear();
  const url = TREASURY_CSV_URL.replaceAll("{year}", String(year));
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`Treasury API responded with ${response.status}`);
  }
  const csv = await response.text();
  const curve = parseLatestRow(csv);

  await cacheSet(CACHE_KEY, curve);
  return curve;
}
