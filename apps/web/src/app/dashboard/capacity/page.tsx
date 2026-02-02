import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CapacityPage() {
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
        <h1 className="text-2xl font-bold">Capacity</h1>
        <p className="text-muted-foreground">Manufacturer access only.</p>
      </div>
    );
  }

  const { data: capacity } = await supabase
    .from("capacity_settings")
    .select("units_per_day")
    .eq("manufacturer_org_id", profile.org_id)
    .single();
  const { data: blackoutDates } = await supabase
    .from("capacity_blackout_dates")
    .select("date, reason")
    .eq("manufacturer_org_id", profile.org_id)
    .order("date");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Capacity</h1>
        <p className="text-muted-foreground">Units per day and blackout dates.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardContent className="pt-0">
            <p className="text-sm">Units per day: {capacity?.units_per_day ?? 100}</p>
          </CardContent>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Blackout dates</CardTitle>
          <CardContent className="pt-0">
            {blackoutDates && blackoutDates.length > 0 ? (
              <ul className="text-sm space-y-1">
                {blackoutDates.map((b) => (
                  <li key={b.date}>{b.date} {b.reason ? `— ${b.reason}` : ""}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No blackout dates.</p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
