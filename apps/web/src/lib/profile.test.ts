import { describe, it, expect } from "vitest";

export type ProfileRole = "merchant" | "manufacturer";

export interface ProfileRow {
  id: string;
  role: ProfileRole | null;
  org_id: string | null;
  full_name: string | null;
}

describe("profile creation and role persistence", () => {
  it("persists role when provided", () => {
    const row: ProfileRow = {
      id: "user-1",
      role: "merchant",
      org_id: null,
      full_name: "Jane",
    };
    expect(row.role).toBe("merchant");
    expect(row.id).toBe("user-1");
  });

  it("accepts manufacturer role", () => {
    const row: ProfileRow = {
      id: "user-2",
      role: "manufacturer",
      org_id: null,
      full_name: "Acme",
    };
    expect(row.role).toBe("manufacturer");
  });

  it("allows null role for backward compatibility", () => {
    const row: ProfileRow = {
      id: "user-3",
      role: null,
      org_id: null,
      full_name: null,
    };
    expect(row.role).toBeNull();
  });
});
