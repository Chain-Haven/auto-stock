/**
 * Quote → PO conversion and stage timeline rules.
 */

export type QuoteStatus = "draft" | "requested" | "quoted" | "accepted" | "rejected";
export type POStatus = "open" | "in_production" | "shipped" | "closed" | "cancelled";
export type StageName = "quoted" | "confirmed" | "in_production" | "qc" | "ready_to_ship" | "shipped";

export function canConvertQuoteToPO(quoteStatus: QuoteStatus): boolean {
  return quoteStatus === "accepted";
}

export function nextStage(current: StageName | null): StageName | null {
  const order: StageName[] = ["quoted", "confirmed", "in_production", "qc", "ready_to_ship", "shipped"];
  if (!current) return "quoted";
  const i = order.indexOf(current);
  if (i < 0 || i >= order.length - 1) return null;
  return order[i + 1];
}

export function stageDisplayName(stage: StageName): string {
  const names: Record<StageName, string> = {
    quoted: "Quoted",
    confirmed: "Confirmed",
    in_production: "In production",
    qc: "QC",
    ready_to_ship: "Ready to ship",
    shipped: "Shipped",
  };
  return names[stage] ?? stage;
}
