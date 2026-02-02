import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function StoresPage() {
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
        <h1 className="text-2xl font-bold">Stores</h1>
        <p className="text-muted-foreground">Create or join a merchant organization to connect stores.</p>
      </div>
    );
  }

  const { data: stores } = await supabase
    .from("stores")
    .select("id, name, site_url, last_sync_at")
    .eq("merchant_org_id", profile.org_id)
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Connected stores</h1>
        <p className="text-muted-foreground">WooCommerce stores linked to your organization.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Stores</CardTitle>
          <CardContent className="pt-0">
            {stores && stores.length > 0 ? (
              <ul className="space-y-2" data-testid="stores-list">
                {stores.map((s) => (
                  <li key={s.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <span className="font-medium">{s.name}</span>
                      {s.site_url && <span className="text-muted-foreground text-sm ml-2">({s.site_url})</span>}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Last sync: {s.last_sync_at ? new Date(s.last_sync_at).toLocaleString() : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground" data-testid="stores-empty">No stores connected yet.</p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
