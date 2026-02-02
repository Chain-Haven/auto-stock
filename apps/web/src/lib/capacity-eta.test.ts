import { describe, it, expect } from "vitest";
import { addBusinessDays, capacityEta } from "./capacity-eta";

describe("capacity ETA helper", () => {
  it("addBusinessDays skips blackout dates", () => {
    const start = new Date("2025-02-01");
    const blackout = [new Date("2025-02-02"), new Date("2025-02-03")];
    const end = addBusinessDays(start, 2, blackout);
    expect(end.toDateString()).toBe(new Date("2025-02-05").toDateString());
  });

  it("capacityEta computes days from units and unitsPerDay", () => {
    const start = new Date("2025-02-01");
    const eta = capacityEta(150, 50, start, []);
    expect(eta >= start).toBe(true);
    const daysDiff = Math.ceil((eta.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    expect(daysDiff).toBe(3);
  });
});
