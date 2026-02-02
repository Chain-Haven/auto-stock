import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  async function signOut() {
    "use server";
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold">
            Auto-Stock
          </Link>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/dashboard/stores" className="hover:text-foreground">
              Stores
            </Link>
            <Link href="/dashboard/inventory" className="hover:text-foreground">
              Inventory
            </Link>
            <Link href="/dashboard/notifications" className="hover:text-foreground">
              Notifications
            </Link>
            <Link href="/dashboard/catalog" className="hover:text-foreground">
              Catalog
            </Link>
            <Link href="/dashboard/orders" className="hover:text-foreground">
              Orders
            </Link>
            <Link href="/dashboard/capacity" className="hover:text-foreground">
              Capacity
            </Link>
            <Link href="/dashboard/connections" className="hover:text-foreground">
              Connections
            </Link>
            <Link href="/dashboard/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/dashboard/copilot" className="hover:text-foreground">
              Copilot
            </Link>
            <Link href="/dashboard/admin/health" className="hover:text-foreground">
              Ops Health
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {profile?.full_name ?? user.email}
          </span>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
