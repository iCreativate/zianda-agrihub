"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  broilerFeeds,
  broilerSections,
  equipmentPer1000,
  feedingRecommendations,
  growthGuide,
  managementContent,
  pefRatings,
  threePhaseFeeding,
  vaccinationExample,
  type BroilerSectionId
} from "@/lib/broilers/manual";
import { cn } from "@/lib/utils";

export function BroilerGuide(props: { initialSection?: BroilerSectionId }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [section, setSection] = useState<BroilerSectionId>(props.initialSection ?? "overview");

  useEffect(() => {
    const fromUrl = searchParams.get("section");
    if (fromUrl && broilerSections.some((item) => item.id === fromUrl)) {
      setSection(fromUrl as BroilerSectionId);
    }
  }, [searchParams]);

  const selectSection = useCallback(
    (id: BroilerSectionId) => {
      setSection(id);
      const next = new URLSearchParams(searchParams.toString());
      if (id === "overview") next.delete("section");
      else next.set("section", id);
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="space-y-6">
      <nav
        aria-label="Broiler guide sections"
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {broilerSections.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectSection(item.id)}
            className={cn(
              "shrink-0 rounded-control border px-3 py-2 text-sm font-medium transition",
              section === item.id
                ? "border-ink bg-ink text-paper"
                : "border-stone-strong bg-paper text-ink-muted hover:border-ink/20 hover:text-ink"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <SectionBody section={section} />
    </div>
  );
}

function SectionBody({ section }: { section: BroilerSectionId }) {
  if (section === "feeds") return <FeedsPanel />;
  if (section === "performance") return <PerformancePanel />;

  const content = managementContent[section];
  const meta = broilerSections.find((item) => item.id === section);

  return (
    <section className="space-y-6">
      <header>
        <p className="section-eyebrow">Broiler management</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{content.title}</h2>
        {meta && <p className="page-lede mt-2">{meta.summary}</p>}
      </header>

      <div className="space-y-4 text-[15px] leading-relaxed text-ink-muted">
        {content.paragraphs.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}
      </div>

      {content.bullets && content.bullets.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {content.bullets.map((item) => (
            <li
              key={item}
              className="flex gap-2 rounded-control border border-stone bg-paper/80 px-3 py-2.5 text-sm text-ink"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crop" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {content.callouts?.map((callout) => (
        <aside
          key={callout.title}
          className="rounded-card border border-crop/20 bg-crop-soft/60 px-4 py-4 md:px-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-crop">
            {callout.title}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">{callout.body}</p>
        </aside>
      ))}

      {section === "housing" && <EquipmentTable />}
      {section === "feeding" && <FeedingProgramme />}
      {section === "health" && <VaccinationTable />}
    </section>
  );
}

function FeedsPanel() {
  const [active, setActive] = useState(0);
  const feed = broilerFeeds[active];

  return (
    <section className="space-y-6">
      <header>
        <p className="section-eyebrow">Poultry product manual</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">AFGRI broiler feeds</h2>
        <p className="page-lede mt-2">
          Nutrient specs are registration minima/maxima (g/kg). Actual values may differ within
          registered bounds.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {broilerFeeds.map((item, index) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "rounded-control border px-3 py-2 text-left text-sm transition",
              active === index
                ? "border-crop bg-crop-soft text-ink"
                : "border-stone-strong bg-paper text-ink-muted hover:text-ink"
            )}
          >
            <span className="block font-semibold">{item.name}</span>
            <span className="text-xs opacity-70">{item.code}</span>
          </button>
        ))}
      </div>

      <article className="surface space-y-5 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-ink">{feed.name}</h3>
            <p className="mt-1 text-sm text-ink-muted">
              {feed.class} · Reg. {feed.regNo} (Act 36/1947)
            </p>
          </div>
          <p className="rounded-control bg-ivory-deep px-2.5 py-1 text-xs font-semibold text-ink">
            {feed.code}
          </p>
        </div>

        <p className="text-[15px] leading-relaxed text-ink">{feed.objective}</p>
        <p className="text-sm leading-relaxed text-ink-muted">
          <span className="font-semibold text-ink">Feeding: </span>
          {feed.feeding}
        </p>
        <p className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">Texture: </span>
          {feed.texture}
          <span className="mx-2 text-stone-strong">·</span>
          <span className="font-semibold text-ink">Packaging: </span>
          {feed.packaging}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone text-[11px] uppercase tracking-eyebrow text-ink-subtle">
                <th className="pb-2 font-semibold">Nutrient</th>
                <th className="pb-2 font-semibold">Spec (g/kg)</th>
                <th className="pb-2 font-semibold">Bound</th>
              </tr>
            </thead>
            <tbody>
              {feed.nutrients.map((row) => (
                <tr key={row.nutrient} className="border-b border-stone/70">
                  <td className="py-2.5 font-medium text-ink">{row.nutrient}</td>
                  <td className="py-2.5 text-ink-muted">{row.value}</td>
                  <td className="py-2.5 text-ink-muted">{row.bound}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {feed.highlights.map((point) => (
            <li key={point} className="flex gap-2 text-sm text-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-wheat" />
              {point}
            </li>
          ))}
        </ul>

        {feed.notes.length > 0 && (
          <ul className="space-y-1 border-t border-stone pt-4 text-xs text-ink-subtle">
            {feed.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

function EquipmentTable() {
  return (
    <div className="overflow-x-auto rounded-card border border-stone bg-paper">
      <table className="w-full min-w-[520px] text-left text-sm">
        <caption className="sr-only">Feed and water space per 1000 broilers</caption>
        <thead>
          <tr className="border-b border-stone bg-ivory-deep/80 text-[11px] uppercase tracking-eyebrow text-ink-subtle">
            <th className="px-3 py-2.5 font-semibold">Age (days)</th>
            <th className="px-3 py-2.5 font-semibold">Chick fonts</th>
            <th className="px-3 py-2.5 font-semibold">Auto drinkers</th>
            <th className="px-3 py-2.5 font-semibold">Scratch trays</th>
            <th className="px-3 py-2.5 font-semibold">Feeders</th>
          </tr>
        </thead>
        <tbody>
          {equipmentPer1000.map((row) => (
            <tr key={row.ageDays} className="border-b border-stone/70">
              <td className="px-3 py-2 font-medium text-ink">{row.ageDays}</td>
              <td className="px-3 py-2 text-ink-muted">{row.chickFonts ?? "—"}</td>
              <td className="px-3 py-2 text-ink-muted">{row.autoDrinkers ?? "—"}</td>
              <td className="px-3 py-2 text-ink-muted">{row.scratchTrays ?? "—"}</td>
              <td className="px-3 py-2 text-ink-muted">{row.feeders ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-3 py-2 text-xs text-ink-subtle">Guide per 1000 broilers (AFGRI).</p>
    </div>
  );
}

function FeedingProgramme() {
  const rec = feedingRecommendations;
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-card border border-stone bg-paper">
        <table className="w-full min-w-[400px] text-left text-sm">
          <caption className="border-b border-stone px-3 py-2.5 text-left text-sm font-semibold text-ink">
            3-phase Topgro programme
          </caption>
          <thead>
            <tr className="border-b border-stone text-[11px] uppercase tracking-eyebrow text-ink-subtle">
              <th className="px-3 py-2 font-semibold">Ration</th>
              <th className="px-3 py-2 font-semibold">Days</th>
              <th className="px-3 py-2 font-semibold">g / bird</th>
            </tr>
          </thead>
          <tbody>
            {threePhaseFeeding.map((row) => (
              <tr key={row.ration} className="border-b border-stone/70">
                <td className="px-3 py-2 font-medium text-ink">{row.ration}</td>
                <td className="px-3 py-2 text-ink-muted">{row.days}</td>
                <td className="px-3 py-2 text-ink-muted">{row.gramsPerBird}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-card border border-stone bg-paper p-4">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
            35-day slaughter
          </p>
          <p className="mt-2 text-sm text-ink">
            Starter {rec.days35.starterG} g · Grower {rec.days35.growerG} g · Finisher{" "}
            {rec.days35.finisherG} g
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            100 birds: {rec.bagsPer100.days35.starter}/{rec.bagsPer100.days35.grower}/
            {rec.bagsPer100.days35.finisher} bags · 1000 birds: {rec.bagsPer1000.days35.starter}/
            {rec.bagsPer1000.days35.grower}/{rec.bagsPer1000.days35.finisher} bags
          </p>
        </div>
        <div className="rounded-card border border-stone bg-paper p-4">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
            38-day slaughter
          </p>
          <p className="mt-2 text-sm text-ink">
            Starter {rec.days38.starterG} g · Grower {rec.days38.growerG} g · Finisher{" "}
            {rec.days38.finisherG} g
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            100 birds: {rec.bagsPer100.days38.starter}/{rec.bagsPer100.days38.grower}/
            {rec.bagsPer100.days38.finisher} bags · 1000 birds: {rec.bagsPer1000.days38.starter}/
            {rec.bagsPer1000.days38.grower}/{rec.bagsPer1000.days38.finisher} bags
          </p>
        </div>
      </div>
    </div>
  );
}

function VaccinationTable() {
  return (
    <div className="overflow-x-auto rounded-card border border-stone bg-paper">
      <table className="w-full min-w-[360px] text-left text-sm">
        <caption className="border-b border-stone px-3 py-2.5 text-left text-sm font-semibold text-ink">
          Example vaccination programme
        </caption>
        <tbody>
          {vaccinationExample.map((row) => (
            <tr key={row.day} className="border-b border-stone/70">
              <td className="whitespace-nowrap px-3 py-2.5 font-medium text-ink">{row.day}</td>
              <td className="px-3 py-2.5 text-ink-muted">{row.vaccine}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-3 py-2 text-xs text-ink-subtle">
        Example only — confirm programme and technique with a poultry veterinarian.
      </p>
    </div>
  );
}

function PerformancePanel() {
  return (
    <section className="space-y-6">
      <header>
        <p className="section-eyebrow">Targets & efficiency</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
          Growth, FCR & PEF
        </h2>
        <p className="page-lede mt-2">
          Guideline figures only. Live weights can vary ±20% with density, housing, ventilation,
          disease, and management. Day-old weight assumed ~40 g.
        </p>
      </header>

      <div className="overflow-x-auto rounded-card border border-stone bg-paper">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone bg-ivory-deep/80 text-[11px] uppercase tracking-eyebrow text-ink-subtle">
              <th className="px-3 py-2.5 font-semibold">Week</th>
              <th className="px-3 py-2.5 font-semibold">Daily gain (g)</th>
              <th className="px-3 py-2.5 font-semibold">Live weight (g)</th>
              <th className="px-3 py-2.5 font-semibold">Weekly feed (g)</th>
              <th className="px-3 py-2.5 font-semibold">Cum. feed (g)</th>
              <th className="px-3 py-2.5 font-semibold">FCR</th>
            </tr>
          </thead>
          <tbody>
            {growthGuide.map((row) => (
              <tr key={row.week} className="border-b border-stone/70">
                <td className="px-3 py-2 font-medium text-ink">{row.week}</td>
                <td className="px-3 py-2 text-ink-muted">{row.dailyGainG}</td>
                <td className="px-3 py-2 text-ink-muted">{row.liveWeightG}</td>
                <td className="px-3 py-2 text-ink-muted">{row.weeklyFeedG}</td>
                <td className="px-3 py-2 text-ink-muted">{row.cumulativeFeedG}</td>
                <td className="px-3 py-2 text-ink-muted">{row.fcr.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <aside className="rounded-card border border-stone bg-paper p-5">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
            Feed conversion ratio
          </p>
          <p className="mt-3 font-mono text-lg text-ink">FCR = total feed ÷ total live weight</p>
          <p className="mt-2 text-sm text-ink-muted">
            Total feed consumed ÷ total weight of birds sold.
          </p>
        </aside>
        <aside className="rounded-card border border-stone bg-paper p-5">
          <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
            Performance efficiency factor
          </p>
          <p className="mt-3 font-mono text-sm leading-relaxed text-ink">
            PEF = (% survivors × avg weight kg × 100) ÷ (avg age days × FCR)
          </p>
        </aside>
      </div>

      <div className="overflow-x-auto rounded-card border border-stone bg-paper">
        <table className="w-full min-w-[280px] text-left text-sm">
          <caption className="border-b border-stone px-3 py-2.5 text-left text-sm font-semibold text-ink">
            PEF rating bands
          </caption>
          <tbody>
            {pefRatings.map((row) => (
              <tr key={row.range} className="border-b border-stone/70">
                <td className="px-3 py-2 font-medium text-ink">{row.range}</td>
                <td className="px-3 py-2 text-ink-muted">{row.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
