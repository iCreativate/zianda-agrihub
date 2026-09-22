"use client";

import { getBreedKnowledge } from "@/lib/assistant/breed-knowledge";

interface LivestockKnowledgePanelProps {
  species: string;
  breed?: string;
}

export function LivestockKnowledgePanel(props: LivestockKnowledgePanelProps) {
  const knowledge = getBreedKnowledge(props.species, props.breed);
  if (!knowledge) return null;

  return (
    <section className="space-y-2 surface p-4">
      <header>
        <p className="section-eyebrow">Learn more about this breed</p>
        <p className="mt-1 text-sm font-semibold">{knowledge.heading}</p>
      </header>
      <p className="text-xs leading-relaxed text-ink-muted">{knowledge.summary}</p>
      <ul className="mt-1 space-y-1 text-xs text-ink-muted">
        {knowledge.points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-crop" />
            <span className="leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
