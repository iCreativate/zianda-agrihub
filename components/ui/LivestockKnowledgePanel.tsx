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
    <section className="space-y-2 rounded-2xl border border-emerald-500/40 bg-slate-900/80 p-4 shadow-md shadow-emerald-500/20">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Learn more about this breed
        </p>
        <p className="mt-0.5 text-sm font-semibold text-slate-100">{knowledge.heading}</p>
      </header>
      <p className="text-xs leading-relaxed text-slate-300">{knowledge.summary}</p>
      <ul className="mt-1 space-y-1 text-xs text-slate-200">
        {knowledge.points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="mt-[5px] h-1 w-1 rounded-full bg-emerald-400" />
            <span className="leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

