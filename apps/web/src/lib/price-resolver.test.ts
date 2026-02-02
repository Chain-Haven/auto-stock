import { describe, it, expect } from "vitest";
import { resolvePrice, isPriceLocked } from "./price-resolver";

describe("price resolver priority and locking", () => {
  it("prefers negotiated over catalog", () => {
    const r = resolvePrice(
      { type: "negotiated", unitPriceCents: 500 },
      1000
    );
    expect(r?.unitPriceCents).toBe(500);
    expect(r?.source).toBe("negotiated");
  });

  it("falls back to catalog when no negotiated", () => {
    const r = resolvePrice(null, 1000);
    expect(r?.unitPriceCents).toBe(1000);
    expect(r?.source).toBe("catalog");
  });

  it("falls back to catalog when negotiated expired", () => {
    const r = resolvePrice(
      { type: "negotiated", unitPriceCents: 500, validUntil: "2020-01-01" },
      1000
    );
    expect(r?.unitPriceCents).toBe(1000);
    expect(r?.source).toBe("catalog");
  });

  it("isPriceLocked returns true for valid negotiated", () => {
    expect(isPriceLocked({ type: "negotiated", unitPriceCents: 500 })).toBe(true);
    expect(isPriceLocked({ type: "negotiated", unitPriceCents: 500, validUntil: "2030-01-01" })).toBe(true);
  });

  it("isPriceLocked returns false for expired or missing", () => {
    expect(isPriceLocked(null)).toBe(false);
    expect(isPriceLocked({ type: "negotiated", unitPriceCents: 500, validUntil: "2020-01-01" })).toBe(false);
  });
});
