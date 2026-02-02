import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, org_id")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "manufacturer" || !profile?.org_id) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Catalog</h1>
        <p className="text-muted-foreground">Manufacturer access only.</p>
      </div>
    );
  }

  const { data: catalog } = await supabase
    .from("catalog")
    .select("id, sku, name, moq, lead_time_days, base_price_cents")
    .eq("manufacturer_org_id", profile.org_id)
    .order("sku");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Catalog</h1>
          <p className="text-muted-foreground">Products, MOQ, lead time, tiers.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/catalog/new">New product</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardContent className="pt-0">
            {catalog && catalog.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="catalog-list">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">SKU</th>
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">MOQ</th>
                      <th className="text-left py-2">Lead time (days)</th>
                      <th className="text-left py-2">Base price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catalog.map((row) => (
                      <tr key={row.id} className="border-b">
                        <td className="py-2 font-mono">{row.sku}</td>
                        <td className="py-2">{row.name}</td>
                        <td className="py-2">{row.moq}</td>
                        <td className="py-2">{row.lead_time_days}</td>
                        <td className="py-2">{row.base_price_cents != null ? `$${(row.base_price_cents / 100).toFixed(2)}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground" data-testid="catalog-empty">No catalog products yet.</p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
