"use client";

import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  HeartPulse,
  PawPrint,
  Receipt,
  ShoppingBag,
  Sprout
} from "lucide-react";
import type { ActivityEvent, ActivityKind } from "@/lib/dashboard/activity";

const KIND_META: Record<
  ActivityKind,
  { icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  livestock: { icon: PawPrint, tone: "bg-ivory-deep text-ink" },
  field: { icon: Sprout, tone: "bg-crop-soft text-crop" },
  health: { icon: HeartPulse, tone: "bg-clay-soft text-clay" },
  expense: { icon: Receipt, tone: "bg-wheat-soft text-ink" },
  sale: { icon: ShoppingBag, tone: "bg-sky-soft text-sky" }
};

export function ActivityFeed(props: { events: ActivityEvent[]; loading?: boolean }) {
  return (
    <section className="flex h-full flex-col rounded-card border border-stone bg-paper/95 p-5 shadow-soft backdrop-blur-sm md:p-6">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="section-eyebrow">Live feed</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Recent activity</h2>
        </div>
        <Link href="/tasks" className="home-text-link link-quiet inline-flex items-center gap-1">
          All tasks
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {props.loading ? (
        <div className="space-y-4">
          {[0, 1, 2, 3].map((key) => (
            <div key={key} className="flex gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-stone/40" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-stone/40" />
                <div className="h-4 w-full animate-pulse rounded bg-stone/30" />
              </div>
            </div>
          ))}
        </div>
      ) : props.events.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center py-10 text-center">
          <CircleDollarSign className="mx-auto h-8 w-8 text-ink-subtle" />
          <p className="mt-3 text-lg font-semibold tracking-tight text-ink">No activity yet</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink-muted">
            Add animals, fields, or expenses to see your farm come alive here.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/livestock/new" className="btn-secondary min-h-11">
              Add animal
            </Link>
            <Link href="/vegetation/new" className="btn-secondary min-h-11">
              Add field
            </Link>
          </div>
        </div>
      ) : (
        <ol className="relative space-y-0">
          {props.events.map((event, index) => {
            const meta = KIND_META[event.kind];
            const Icon = meta.icon;
            const isLast = index === props.events.length - 1;

            const content = (
              <>
                <span
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.tone}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 pb-6">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
                    {event.timeLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">{event.title}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{event.detail}</p>
                </div>
              </>
            );

            return (
              <li key={event.id} className="relative flex gap-3">
                {!isLast && (
                  <span
                    className="absolute left-[18px] top-9 bottom-0 w-px bg-stone"
                    aria-hidden
                  />
                )}
                {event.href ? (
                  <Link
                    href={event.href}
                    className="group flex w-full gap-3 rounded-control py-1 transition hover:bg-ivory/60"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="flex w-full gap-3 py-1">{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
