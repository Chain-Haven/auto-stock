"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorTestPage() {
  useEffect(() => {
    Sentry.captureMessage("Error test route hit (expected)", "info");
  }, []);

  const triggerError = () => {
    throw new Error("Sentry test error from client (expected)");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">Sentry error test</h1>
      <p className="text-muted-foreground text-center max-w-md">
        This page is used to verify Sentry captures client errors. Click the button to trigger a test error.
      </p>
      <Button onClick={triggerError}>Trigger test error</Button>
      <Button variant="outline" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
