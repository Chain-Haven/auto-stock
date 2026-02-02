import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PricingPage() {
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
        <h1 className="text-2xl font-bold">Negotiated pricing</h1>
        <p className="text-muted-foreground">Manufacturer access only.</p>
      </div>
    );
  }

  const { data: pricing } = await supabase
    .from("negotiated_pricing")
    .select("id, connection_id, sku, unit_price_cents, valid_from, valid_until")
    .order("valid_from", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Negotiated pricing</h1>
        <p className="text-muted-foreground">Per-SKU pricing and terms (audit in DB).</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardContent className="pt-0">
            {pricing && pricing.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="pricing-list">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">SKU</th>
                      <th className="text-left py-2">Unit price</th>
                      <th className="text-left py-2">Valid from</th>
                      <th className="text-left py-2">Valid until</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricing.map((row) => (
                      <tr key={row.id} className="border-b">
                        <td className="py-2 font-mono">{row.sku}</td>
                        <td className="py-2">${(row.unit_price_cents / 100).toFixed(2)}</td>
                        <td className="py-2">{row.valid_from}</td>
                        <td className="py-2">{row.valid_until ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground" data-testid="pricing-empty">No negotiated pricing yet.</p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
