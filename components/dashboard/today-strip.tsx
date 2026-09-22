"use client";

import Link from "next/link";
import { ArrowRight, CircleDollarSign, HeartPulse, ListTodo, PawPrint, Sprout } from "lucide-react";
import { formatMoney, formatNumber } from "@/lib/format";

type TodayMetric = {
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "urgent" | "clear";
};

export function TodayStrip(props: {
  livestock: number;
  fields: number;
  urgentHealth: number;
  revenueLabel: string;
  overdueTasks: number;
  loading?: boolean;
}) {
  const metrics: TodayMetric[] = [
    {
      label: "Livestock",
      value: props.loading ? "—" : formatNumber(props.livestock),
      href: "/livestock",
      icon: PawPrint
    },
    {
      label: "Active fields",
      value: props.loading ? "—" : formatNumber(props.fields),
      href: "/vegetation",
      icon: Sprout
    },
    {
      label: "Health",
      value: props.loading ? "—" : props.urgentHealth > 0 ? `${props.urgentHealth} due` : "All clear",
      href: "/vaccinations",
      icon: HeartPulse,
      tone: props.urgentHealth > 0 ? "urgent" : "clear"
    },
    {
      label: "Revenue",
      value: props.loading ? "—" : props.revenueLabel,
      href: "/income",
      icon: CircleDollarSign
    },
    {
      label: "Tasks",
      value: props.loading ? "—" : props.overdueTasks > 0 ? `${props.overdueTasks} overdue` : "On track",
      href: "/tasks",
      icon: ListTodo,
      tone: props.overdueTasks > 0 ? "urgent" : "default"
    }
  ];

  return (
    <section
      aria-label="Today on your farm"
      className="relative z-10 -mt-6 mx-auto max-w-[1200px] rounded-card border border-stone/80 bg-paper/95 px-4 py-5 shadow-lift backdrop-blur-md md:-mt-8 md:px-6 md:py-6"
    >
      <p className="text-center text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
        Today on your farm
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const valueClass =
            metric.tone === "urgent"
              ? "text-clay"
              : metric.tone === "clear"
                ? "text-crop"
                : "text-ink";

          return (
            <Link
              key={metric.label}
              href={metric.href}
              className="home-trust-item group rounded-control px-2 py-2 text-center transition md:px-3 md:py-3"
            >
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-ivory-deep text-ink-muted transition group-hover:-translate-y-0.5 group-hover:bg-crop-soft group-hover:text-crop">
                <Icon className="h-4 w-4" />
              </span>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
                {metric.label}
              </p>
              <p className={`mt-1 text-lg font-semibold tracking-tight tabular-nums md:text-xl ${valueClass}`}>
                {metric.value}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-ink-subtle opacity-0 transition group-hover:opacity-100">
                Open
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function revenueSummary(sellingCount: number) {
  if (sellingCount > 0) {
    return `${sellingCount} listing${sellingCount === 1 ? "" : "s"}`;
  }
  return formatMoney(0);
}
