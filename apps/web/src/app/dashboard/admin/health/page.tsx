import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHealthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, org_id")
    .eq("id", user.id)
    .single();

  const migrationVersion = "20250201000006";
  const { data: lastJobs } = await supabase
    .from("jobs")
    .select("id, name, status, started_at, completed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ops Health</h1>
        <p className="text-muted-foreground">Internal admin view (protected)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Migration version</CardTitle>
          <CardContent className="pt-0">
            <p className="font-mono text-sm">{migrationVersion}</p>
          </CardContent>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Last job runs</CardTitle>
          <CardContent className="pt-0">
            {lastJobs && lastJobs.length > 0 ? (
              <ul className="text-sm space-y-1">
                {lastJobs.map((j) => (
                  <li key={j.id}>
                    <span className="font-mono">{j.name}</span> — {j.status} — {j.created_at}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No jobs yet (stub)</p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sync health</CardTitle>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm">Stub — last import/webhook placeholders (M3)</p>
          </CardContent>
        </CardHeader>
      </Card>
      <p className="text-xs text-muted-foreground">
        Profile: role={profile?.role ?? "—"} org_id={profile?.org_id ?? "—"}
      </p>
    </div>
  );
}
