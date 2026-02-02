import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, org_id")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "merchant" || !profile?.org_id) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">Merchant access only.</p>
      </div>
    );
  }

  const { data: stores } = await supabase
    .from("stores")
    .select("id, name")
    .eq("merchant_org_id", profile.org_id);
  const storeIds = stores?.map((s) => s.id) ?? [];

  let inventoryBySku: { sku: string; name: string | null; stores: { storeName: string; quantity: number }[] }[] = [];
  if (storeIds.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id, sku, name")
      .eq("merchant_org_id", profile.org_id);
    const productIds = products?.map((p) => p.id) ?? [];
    if (productIds.length > 0) {
      const { data: inv } = await supabase
        .from("inventory")
        .select("store_id, product_id, quantity")
        .in("store_id", storeIds)
        .in("product_id", productIds);
      const storeMap = new Map(stores?.map((s) => [s.id, s.name]) ?? []);
      const productMap = new Map(products?.map((p) => [p.id, { sku: p.sku, name: p.name }]) ?? []);
      const byProduct = new Map<string, { name: string | null; stores: { storeName: string; quantity: number }[] }>();
      inv?.forEach((i) => {
        const p = productMap.get(i.product_id);
        if (!p) return;
        if (!byProduct.has(p.sku)) byProduct.set(p.sku, { name: p.name, stores: [] });
        const rec = byProduct.get(p.sku)!;
        rec.stores.push({ storeName: storeMap.get(i.store_id) ?? i.store_id, quantity: i.quantity });
      });
      inventoryBySku = Array.from(byProduct.entries()).map(([sku, v]) => ({ sku, name: v.name, stores: v.stores }));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory by SKU</h1>
        <p className="text-muted-foreground">Quantity across your connected stores.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardContent className="pt-0">
            {inventoryBySku.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="inventory-list">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">SKU</th>
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Stores / Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryBySku.map((row) => (
                      <tr key={row.sku} className="border-b">
                        <td className="py-2 font-mono">{row.sku}</td>
                        <td className="py-2">{row.name ?? "—"}</td>
                        <td className="py-2">
                          {row.stores.map((s) => `${s.storeName}: ${s.quantity}`).join(", ") || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground" data-testid="inventory-empty">
                No inventory yet. Connect stores and import products.
              </p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
