"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProfileRole = "merchant" | "manufacturer" | null;

interface Step {
  id: string;
  label: string;
  done: boolean;
}

interface SetupChecklistProps {
  role: ProfileRole;
  hasOrg: boolean;
}

export function SetupChecklist({ role, hasOrg }: SetupChecklistProps) {
  const steps: Step[] = [
    { id: "account", label: "Create account", done: true },
    { id: "role", label: "Select role (merchant or manufacturer)", done: !!role },
    { id: "org", label: "Create or join organization", done: hasOrg },
    { id: "stores", label: "Connect stores (merchant) or catalog (manufacturer)", done: false },
  ];

  return (
    <ul className="space-y-3" role="list">
      {steps.map((step) => (
        <li
          key={step.id}
          className={cn(
            "flex items-center gap-3 text-sm",
            step.done ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {step.done ? (
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" aria-hidden />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden />
          )}
          <span>{step.label}</span>
        </li>
      ))}
    </ul>
  );
}
