import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ConnectionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Connections</h1>
        <p className="text-muted-foreground">Create or join an organization first.</p>
      </div>
    );
  }

  const isMerchant = profile.role === "merchant";
  const { data: connections } = await supabase
    .from("connections")
    .select("id, merchant_org_id, manufacturer_org_id, status, created_at")
    .or(isMerchant ? `merchant_org_id.eq.${profile.org_id}` : `manufacturer_org_id.eq.${profile.org_id}`)
    .order("created_at", { ascending: false });

  const orgIds = new Set<string>();
  connections?.forEach((c) => {
    orgIds.add(c.merchant_org_id);
    orgIds.add(c.manufacturer_org_id);
  });
  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, name, type")
    .in("id", Array.from(orgIds));
  const orgMap = new Map(orgs?.map((o) => [o.id, o.name]) ?? []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Connections</h1>
        <p className="text-muted-foreground">Merchant–manufacturer links. Request or accept.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Connections</CardTitle>
          <CardContent className="pt-0">
            {connections && connections.length > 0 ? (
              <ul className="space-y-2" data-testid="connections-list">
                {connections.map((c) => (
                  <li key={c.id} className="flex justify-between border-b pb-2">
                    <span>
                      {orgMap.get(c.merchant_org_id) ?? c.merchant_org_id} ↔ {orgMap.get(c.manufacturer_org_id) ?? c.manufacturer_org_id}
                    </span>
                    <span>{c.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground" data-testid="connections-empty">No connections yet.</p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
