import { describe, it, expect } from "vitest";
import {
  scopeByOwnOrg,
  scopeStoresByMerchantOrg,
  scopeCatalogByManufacturerOrg,
  scopeConnectionsByMerchant,
  scopeConnectionsByManufacturer,
} from "./rls-helpers";

describe("RLS helper logic and query scoping", () => {
  it("scopeByOwnOrg returns null when orgId is null", () => {
    expect(scopeByOwnOrg(null)).toBeNull();
  });

  it("scopeByOwnOrg returns org_id when orgId is set", () => {
    const result = scopeByOwnOrg("org-123");
    expect(result).toEqual({ org_id: "org-123" });
  });

  it("scopeStoresByMerchantOrg returns null when merchantOrgId is null", () => {
    expect(scopeStoresByMerchantOrg(null)).toBeNull();
  });

  it("scopeStoresByMerchantOrg returns merchant_org_id when set", () => {
    expect(scopeStoresByMerchantOrg("m-1")).toEqual({ merchant_org_id: "m-1" });
  });

  it("scopeCatalogByManufacturerOrg returns manufacturer_org_id when set", () => {
    expect(scopeCatalogByManufacturerOrg("mf-1")).toEqual({ manufacturer_org_id: "mf-1" });
  });

  it("scopeConnectionsByMerchant and ByManufacturer scope correctly", () => {
    expect(scopeConnectionsByMerchant("m-1")).toEqual({ merchant_org_id: "m-1" });
    expect(scopeConnectionsByManufacturer("mf-1")).toEqual({ manufacturer_org_id: "mf-1" });
    expect(scopeConnectionsByMerchant(null)).toBeNull();
    expect(scopeConnectionsByManufacturer(null)).toBeNull();
  });
});
