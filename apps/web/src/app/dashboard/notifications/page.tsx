import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">In-app notifications.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent</CardTitle>
          <CardContent className="pt-0">
            {notifications && notifications.length > 0 ? (
              <ul className="space-y-2" data-testid="notifications-list">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`border-b pb-2 last:border-0 ${n.read_at ? "opacity-70" : ""}`}
                  >
                    <span className="font-medium">{n.title}</span>
                    {n.body && <p className="text-sm text-muted-foreground">{n.body}</p>}
                    <span className="text-xs text-muted-foreground">{n.created_at}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground" data-testid="notifications-empty">No notifications yet.</p>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
