import { describe, it, expect } from "vitest";
import { canConvertQuoteToPO, nextStage, stageDisplayName } from "./quote-po";

describe("quote→PO conversion and stage timeline", () => {
  it("canConvertQuoteToPO only for accepted", () => {
    expect(canConvertQuoteToPO("accepted")).toBe(true);
    expect(canConvertQuoteToPO("quoted")).toBe(false);
    expect(canConvertQuoteToPO("draft")).toBe(false);
  });

  it("nextStage advances correctly", () => {
    expect(nextStage(null)).toBe("quoted");
    expect(nextStage("quoted")).toBe("confirmed");
    expect(nextStage("in_production")).toBe("qc");
    expect(nextStage("shipped")).toBe(null);
  });

  it("stageDisplayName returns readable names", () => {
    expect(stageDisplayName("in_production")).toBe("In production");
    expect(stageDisplayName("shipped")).toBe("Shipped");
  });
});
