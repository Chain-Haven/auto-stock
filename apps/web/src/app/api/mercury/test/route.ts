import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
  if (!profile?.org_id) return NextResponse.json({ error: "No org" }, { status: 403 });
  const { data: integration } = await supabase
    .from("integrations")
    .select("id")
    .eq("org_id", profile.org_id)
    .eq("provider", "mercury")
    .single();
  if (!integration) return NextResponse.json({ ok: false, error: "No Mercury credentials" });
  return NextResponse.json({ ok: true, message: "Test Mercury (mock)" });
}
