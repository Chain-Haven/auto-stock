import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  Sentry.captureMessage("Sentry server route test (expected)", "info");
  throw new Error("Sentry server test error (expected)");
}

export async function POST() {
  return NextResponse.json({ ok: true });
}
