export const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatAmount(value: string): string {
  return amountFormatter.format(Number(value));
}
