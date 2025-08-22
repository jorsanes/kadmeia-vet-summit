// src/components/cases/KpiGrid.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export type Kpi = { label: string; value: string; description?: string };

export function KpiGrid({ items, className }: { items: Kpi[]; className?: string }) {
  if (!items?.length) return null;
  return (
    <section className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((kpi, i) => (
        <article
          key={i}
          className="rounded-2xl border bg-white/60 p-4 shadow-sm backdrop-blur-sm"
          aria-label={kpi.label}
        >
          <div className="text-sm font-medium" style={{ color: "#B38A3F" }}>
            {kpi.label}
          </div>
          <div className="mt-1 text-3xl font-semibold leading-tight">{kpi.value}</div>
          {kpi.description && (
            <p className="mt-1 text-sm text-muted-foreground">{kpi.description}</p>
          )}
        </article>
      ))}
    </section>
  );
}