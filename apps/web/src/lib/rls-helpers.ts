/**
 * RLS helper logic: query scoping by org / user.
 * Used in app to build queries that align with RLS policies.
 */

export type OrgRole = "merchant" | "manufacturer";

export function scopeByOwnOrg(orgId: string | null): { org_id: string } | null {
  if (!orgId) return null;
  return { org_id: orgId };
}

export function scopeStoresByMerchantOrg(merchantOrgId: string | null): { merchant_org_id: string } | null {
  if (!merchantOrgId) return null;
  return { merchant_org_id: merchantOrgId };
}

export function scopeCatalogByManufacturerOrg(manufacturerOrgId: string | null): { manufacturer_org_id: string } | null {
  if (!manufacturerOrgId) return null;
  return { manufacturer_org_id: manufacturerOrgId };
}

export function scopeConnectionsByMerchant(merchantOrgId: string | null): { merchant_org_id: string } | null {
  if (!merchantOrgId) return null;
  return { merchant_org_id: merchantOrgId };
}

export function scopeConnectionsByManufacturer(manufacturerOrgId: string | null): { manufacturer_org_id: string } | null {
  if (!manufacturerOrgId) return null;
  return { manufacturer_org_id: manufacturerOrgId };
}
