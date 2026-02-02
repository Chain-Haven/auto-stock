import { createClient } from "@/lib/supabase/server";
import { SetupChecklist } from "@/components/onboarding/setup-checklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, org_id")
    .eq("id", user.id)
    .single();

  let lastSync: string | null = null;
  if (profile?.org_id) {
    const { data: stores } = await supabase
      .from("stores")
      .select("id, name, last_sync_at")
      .eq("merchant_org_id", profile.org_id)
      .limit(5);
    lastSync = stores?.length ? stores.reduce((a, s) => (s.last_sync_at && (!a || s.last_sync_at > a) ? s.last_sync_at : a), null as string | null) : null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Role: {profile?.role ?? "—"}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Setup checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <SetupChecklist
            role={profile?.role ?? null}
            hasOrg={Boolean(profile?.org_id)}
          />
        </CardContent>
      </Card>
      {profile?.role === "merchant" && (
        <Card data-testid="sync-health-panel">
          <CardHeader>
            <CardTitle>Sync health</CardTitle>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                Last import/webhook: {lastSync ? new Date(lastSync).toLocaleString() : "—"}
              </p>
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
