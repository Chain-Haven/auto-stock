/**
 * Price resolver: negotiated → historical → catalog. Locking rules applied.
 */

export interface PriceSource {
  type: "negotiated" | "historical" | "catalog";
  unitPriceCents: number;
  validUntil?: string | null;
}

export function resolvePrice(
  negotiated: PriceSource | null,
  catalogPriceCents: number | null
): { unitPriceCents: number; source: PriceSource["type"] } | null {
  if (negotiated && negotiated.unitPriceCents >= 0) {
    if (negotiated.validUntil && new Date(negotiated.validUntil) < new Date()) {
      if (catalogPriceCents != null && catalogPriceCents >= 0)
        return { unitPriceCents: catalogPriceCents, source: "catalog" };
      return null;
    }
    return { unitPriceCents: negotiated.unitPriceCents, source: "negotiated" };
  }
  if (catalogPriceCents != null && catalogPriceCents >= 0)
    return { unitPriceCents: catalogPriceCents, source: "catalog" };
  return null;
}

export function isPriceLocked(negotiated: PriceSource | null): boolean {
  if (!negotiated) return false;
  if (negotiated.validUntil && new Date(negotiated.validUntil) < new Date()) return false;
  return true;
}
