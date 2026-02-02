import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, org_id")
    .eq("id", user.id)
    .single();

  let orders: { id: string; status: string; total_cents: number | null; created_at: string }[] = [];
  if (profile?.org_id) {
    const isManufacturer = profile.role === "manufacturer";
    const { data } = await supabase
      .from("purchase_orders")
      .select("id, status, total_cents, created_at")
      .or(isManufacturer ? `manufacturer_org_id.eq.${profile.org_id}` : `merchant_org_id.eq.${profile.org_id}`)
      .order("created_at", { ascending: false })
      .limit(20);
    orders = data ?? [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders Hub</h1>
        <p className="text-muted-foreground">Quotes and purchase orders.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardContent className="pt-0">
            {orders.length > 0 ? (
              <ul className="space-y-2" data-testid="orders-list">
                {orders.map((o) => (
                  <li key={o.id} className="flex justify-between border-b pb-2">
                    <span className="font-mono text-sm">{o.id.slice(0, 8)}…</span>
                    <span>{o.status}</span>
                    <span>{o.total_cents != null ? `$${(o.total_cents / 100).toFixed(2)}` : "—"}</span>
                    <span className="text-muted-foreground text-sm">{o.created_at}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground" data-testid="orders-empty">No orders yet. Create a quote to get started.</p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
