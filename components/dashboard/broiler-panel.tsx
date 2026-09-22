"use client";

import Link from "next/link";
import { ArrowRight, Bird } from "lucide-react";
import {
  broilerFeeds,
  growthDrivers,
  threePhaseFeeding
} from "@/lib/broilers/manual";

export function BroilerPanel() {
  return (
    <section aria-label="Broiler management" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-eyebrow">Poultry</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink md:text-[1.65rem]">
            Broiler management
          </h2>
          <p className="mt-1 max-w-xl text-sm text-ink-muted">
            AFGRI Topgro feeds, housing, brooding, biosecurity, and performance targets — ready
            for the shed.
          </p>
        </div>
        <Link
          href="/broilers"
          className="home-cta inline-flex min-h-11 items-center gap-2 rounded-control border border-stone-strong bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          Open full guide
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-card border border-stone bg-paper/95 p-5 shadow-soft md:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-crop-soft text-crop">
              <Bird className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">Growth & quality drivers</p>
              <p className="mt-1 text-xs text-ink-muted">
                Manage these together for thermal balance and flock performance.
              </p>
            </div>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {growthDrivers.map((driver) => (
              <li
                key={driver}
                className="rounded-control border border-stone bg-ivory-deep/80 px-2.5 py-1 text-xs font-medium text-ink"
              >
                {driver}
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-stone pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
              3-phase Topgro (g / bird)
            </p>
            <ul className="mt-3 space-y-2">
              {threePhaseFeeding.map((row) => (
                <li
                  key={row.ration}
                  className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
                >
                  <span className="font-medium text-ink">{row.ration}</span>
                  <span className="text-ink-muted">
                    {row.days} · {row.gramsPerBird} g
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-card border border-stone bg-paper/95 p-5 shadow-soft md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
            Feed line-up
          </p>
          <ul className="mt-3 divide-y divide-stone/80">
            {broilerFeeds.map((feed) => (
              <li key={feed.code} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-ink">{feed.name}</p>
                  <p className="text-xs text-ink-muted">{feed.class}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-ink-subtle">{feed.code}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/broilers?section=feeds"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crop transition hover:text-ink"
          >
            Nutrient specs & instructions
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            href: "/broilers?section=shed",
            label: "Shed prep",
            note: "28–30°C floor · 30°C chick height · water first"
          },
          {
            href: "/broilers?section=health",
            label: "Health & vaccines",
            note: "NCD, IB, IBD · all-in / all-out biosecurity"
          },
          {
            href: "/broilers?section=performance",
            label: "FCR & PEF",
            note: "Week targets · efficiency rating bands"
          }
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-card border border-stone bg-ivory-deep/50 px-4 py-4 transition hover:border-ink/15 hover:bg-paper hover:shadow-soft"
          >
            <p className="text-sm font-semibold text-ink group-hover:text-crop">{item.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">{item.note}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
