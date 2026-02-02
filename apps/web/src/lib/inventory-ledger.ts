/**
 * Inventory ledger: append-only log + idempotent snapshot update.
 * Append ledger row, then recompute inventory.quantity from sum(delta) per (store_id, product_id).
 */

export interface LedgerRow {
  store_id: string;
  product_id: string;
  delta: number;
  reason?: string;
  reference_id?: string;
}

export function computeSnapshotFromLedger(entries: { delta: number }[]): number {
  return entries.reduce((sum, e) => sum + e.delta, 0);
}

export function appendLedgerEntry(
  currentQuantity: number,
  delta: number,
  reason?: string
): { newQuantity: number; valid: boolean } {
  const newQuantity = currentQuantity + delta;
  if (newQuantity < 0) return { newQuantity: currentQuantity, valid: false };
  return { newQuantity, valid: true };
}
