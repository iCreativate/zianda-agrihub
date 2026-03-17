"use client";

import type { CareContext, CareRecommendation } from "@/lib/assistant/care";
import { getCareRecommendations } from "@/lib/assistant/care";

interface FarmAssistantPanelProps {
  title?: string;
  context: CareContext;
}

export function FarmAssistantPanel(props: FarmAssistantPanelProps) {
  const recommendations: CareRecommendation[] = getCareRecommendations(props.context);

  if (!recommendations.length) return null;

  return (
    <section className="space-y-3 rounded-2xl border border-emerald-500/40 bg-slate-900/80 p-4 shadow-md shadow-emerald-500/20">
      <header className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Farm assistant
          </p>
          <p className="text-xs text-slate-300">
            Practical tips for caring for this {props.context.kind === "crop" ? "crop block" : props.context.kind}.
          </p>
        </div>
      </header>
      <ul className="space-y-2 text-xs">
        {recommendations.map((rec) => (
          <li
            key={rec.id}
            className="rounded-xl border border-slate-700/60 bg-slate-950/70 px-3 py-2"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-100">{rec.title}</p>
              <span
                className={
                  "ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
                  (rec.priority === "high"
                    ? "bg-rose-500/20 text-rose-200"
                    : rec.priority === "normal"
                    ? "bg-emerald-500/20 text-emerald-200"
                    : "bg-slate-600/30 text-slate-200")
                }
              >
                {rec.priority}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-300">{rec.body}</p>
            {rec.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {rec.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

