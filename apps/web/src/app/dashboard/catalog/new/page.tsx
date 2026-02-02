"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewCatalogProductPage() {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [moq, setMoq] = useState(1);
  const [leadTimeDays, setLeadTimeDays] = useState(0);
  const [basePriceCents, setBasePriceCents] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in");
      setLoading(false);
      return;
    }
    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile?.org_id) {
      setError("No organization");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from("catalog").insert({
      manufacturer_org_id: profile.org_id,
      sku: sku.trim(),
      name: name.trim(),
      moq: Math.max(1, moq),
      lead_time_days: Math.max(0, leadTimeDays),
      base_price_cents: basePriceCents ? Math.round(parseFloat(basePriceCents) * 100) : null,
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push("/dashboard/catalog");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New catalog product</h1>
        <p className="text-muted-foreground">Add a product to your manufacturer catalog.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product</CardTitle>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moq">MOQ</Label>
                <Input id="moq" type="number" min={1} value={moq} onChange={(e) => setMoq(parseInt(e.target.value, 10) || 1)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead_time">Lead time (days)</Label>
                <Input id="lead_time" type="number" min={0} value={leadTimeDays} onChange={(e) => setLeadTimeDays(parseInt(e.target.value, 10) || 0)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_price">Base price ($)</Label>
                <Input id="base_price" type="number" step="0.01" min={0} value={basePriceCents} onChange={(e) => setBasePriceCents(e.target.value)} placeholder="0.00" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create"}</Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/catalog">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
