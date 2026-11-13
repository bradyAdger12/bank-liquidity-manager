export interface YieldPoint {
  term: string;
  years: number;
  yieldPercent: number;
}

export interface YieldCurve {
  date: string;
  points: YieldPoint[];
}
