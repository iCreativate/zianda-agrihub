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
    <section className="space-y-3 surface p-4">
      <header>
        <p className="section-eyebrow">Farm assistant</p>
        <p className="mt-1 text-xs text-ink-muted">
          Practical tips for caring for this {props.context.kind === "crop" ? "crop block" : props.context.kind}.
        </p>
      </header>
      <ul className="space-y-2 text-xs">
        {recommendations.map((rec) => (
          <li key={rec.id} className="rounded-control border border-stone bg-ivory px-3 py-2">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold">{rec.title}</p>
              <span
                className={
                  rec.priority === "high"
                    ? "badge-clay"
                    : rec.priority === "normal"
                    ? "badge-crop"
                    : "badge bg-stone text-ink-muted"
                }
              >
                {rec.priority}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">{rec.body}</p>
            {rec.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {rec.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-paper px-2 py-0.5 text-[10px] text-ink-subtle">
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
