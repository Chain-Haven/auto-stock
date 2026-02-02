import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CopilotPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Copilots</h1>
        <p className="text-muted-foreground">Inventory planning and operations next actions (schema-validated).</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory copilot</CardTitle>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">Deterministic reorder math + AI explanation/risk. Autonomy: OFF | RECOMMEND | AUTO-DRAFT.</p>
          </CardContent>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Operations copilot</CardTitle>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">Next actions, drafts, risks. Confirmation gates; no silent auto-execute by default.</p>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
