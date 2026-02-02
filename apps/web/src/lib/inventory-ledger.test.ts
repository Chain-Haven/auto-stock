import { describe, it, expect } from "vitest";
import {
  computeSnapshotFromLedger,
  appendLedgerEntry,
} from "./inventory-ledger";

describe("inventory ledger append and snapshot update", () => {
  it("computeSnapshotFromLedger sums deltas correctly", () => {
    expect(computeSnapshotFromLedger([])).toBe(0);
    expect(computeSnapshotFromLedger([{ delta: 10 }, { delta: -3 }, { delta: 5 }])).toBe(12);
  });

  it("appendLedgerEntry updates quantity idempotently", () => {
    const r1 = appendLedgerEntry(0, 10);
    expect(r1.valid).toBe(true);
    expect(r1.newQuantity).toBe(10);
    const r2 = appendLedgerEntry(10, -3);
    expect(r2.valid).toBe(true);
    expect(r2.newQuantity).toBe(7);
  });

  it("appendLedgerEntry rejects negative resulting quantity", () => {
    const r = appendLedgerEntry(5, -10);
    expect(r.valid).toBe(false);
    expect(r.newQuantity).toBe(5);
  });
});
