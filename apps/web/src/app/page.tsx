import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-muted/30">
      <h1 className="text-4xl font-bold">Auto-Stock</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Multi-store WooCommerce inventory sync and manufacturer collaboration.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </main>
  );
}
