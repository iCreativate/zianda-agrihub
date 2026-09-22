"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  attentionToneLabel,
  type AttentionItem,
  type AttentionTone
} from "@/lib/dashboard/attention";

const TONE_STYLES: Record<AttentionTone, { badge: string; rail: string }> = {
  urgent: {
    badge: "bg-clay-soft text-clay",
    rail: "bg-clay"
  },
  attention: {
    badge: "bg-wheat-soft text-ink",
    rail: "bg-wheat"
  },
  info: {
    badge: "bg-sky-soft text-sky",
    rail: "bg-sky"
  }
};

export function AttentionList(props: { items: AttentionItem[]; loading?: boolean }) {
  if (props.loading) {
    return (
      <section aria-label="Needs your attention" className="space-y-4">
        <Header count={0} />
        <div className="space-y-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-20 animate-pulse rounded-card bg-stone/30" />
          ))}
        </div>
      </section>
    );
  }

  if (props.items.length === 0) {
    return (
      <section aria-label="Needs your attention" className="space-y-4">
        <Header count={0} />
        <div className="flex flex-col gap-4 rounded-card border border-stone bg-paper/90 px-5 py-5 shadow-soft backdrop-blur-sm sm:flex-row sm:items-center md:px-6">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-crop" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold tracking-tight text-ink">All clear</p>
            <p className="mt-1 text-sm text-ink-muted">
              No urgent items right now. Your farm is in good order.
            </p>
          </div>
          <Link
            href="/tasks"
            className="home-cta inline-flex min-h-11 shrink-0 items-center gap-2 rounded-control border border-stone-strong bg-ivory-deep px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            View tasks
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Needs your attention" className="space-y-4">
      <Header count={props.items.length} />
      <div className="space-y-3">
        {props.items.map((item) => {
          const tone = TONE_STYLES[item.tone];
          return (
            <div
              key={item.id}
              className="home-market-card relative overflow-hidden rounded-card border border-stone bg-paper shadow-soft"
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${tone.rail}`} aria-hidden />
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center md:p-6">
                <div className="min-w-0 flex-1 pl-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`badge ${tone.badge}`}>{attentionToneLabel(item.tone)}</span>
                    <span className="text-xs text-ink-subtle">{item.dateLabel}</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-ink">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.context}</p>
                </div>
                <Link
                  href={item.href}
                  className="home-cta group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-control bg-ink px-4 py-2.5 text-sm font-semibold text-paper shadow-soft transition hover:-translate-y-0.5 hover:bg-ink/90 hover:shadow-lift sm:self-center"
                >
                  {item.actionLabel}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Header(props: { count: number }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="section-eyebrow">Priority</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Needs your attention
        </h2>
      </div>
      {props.count > 0 && (
        <span className="badge badge-wheat">{props.count} item{props.count === 1 ? "" : "s"}</span>
      )}
    </div>
  );
}
