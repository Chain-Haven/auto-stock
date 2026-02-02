import * as Sentry from "@sentry/nextjs";

export function addSyncBreadcrumb(event: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    category: "sync",
    message: event,
    data,
    level: "info",
  });
}
