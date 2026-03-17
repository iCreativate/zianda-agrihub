"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type SectionId =
  | "broilers"
  | "layers"
  | "beef"
  | "dairy"
  | "smallstock"
  | "pigs"
  | "cropResidues"
  | "maize"
  | "pasture";

interface ExpandableProps {
  id: SectionId;
  open: boolean;
  onToggle: (id: SectionId) => void;
  title: string;
  badge?: string;
  iconLabel: string;
  summary: string;
  children: React.ReactNode;
}

function ExpandableCard({
  id,
  open,
  onToggle,
  title,
  badge,
  iconLabel,
  summary,
  children,
}: ExpandableProps) {
  return (
    <>
      <article className="space-y-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5">
        <button
          type="button"
          onClick={() => onToggle(id)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
              {iconLabel}
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-50">{title}</h2>
              <p className="mt-0.5 text-xs text-slate-300">{summary}</p>
            </div>
            {badge && (
              <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                {badge}
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </article>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 shadow-2xl shadow-black/60 md:px-6 md:py-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                  {iconLabel}
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {badge}
                  </p>
                  <h2 className="text-base font-semibold text-slate-50">
                    {title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggle(id)}
                className="rounded-full border border-slate-600 bg-slate-800 px-2 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
              >
                Close
              </button>
            </div>
            <p className="mb-3 text-xs text-slate-300">{summary}</p>
            <div className="text-xs text-slate-200">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default function FarmerHubPage() {
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    broilers: true,
    layers: false,
    beef: false,
    dairy: false,
    smallstock: false,
    pigs: false,
    cropResidues: false,
    maize: false,
    pasture: false,
  });

  const toggle = (id: SectionId) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Crops & Livestock
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Farmer Hub: Feeding Guides
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Practical, field-ready guidelines to help you plan feed for different
          animal groups and crop uses on your farm. Use these summaries together
          with advice from your local feed supplier or animal health technician.
        </p>
        <p className="text-xs text-slate-400">
          Values are examples based on common commercial rations. Always check
          labels on actual feed bags and adapt to your own breeds, climate, and
          vet recommendations.
        </p>
      </div>

      <section className="space-y-4 rounded-2xl border-2 border-emerald-500/30 bg-slate-900/80 p-6 shadow-md shadow-emerald-500/20">
        <ExpandableCard
          id="broilers"
          open={openSections.broilers}
          onToggle={toggle}
          title="Broilers – feed specifications & programs"
          badge="Poultry"
          iconLabel="Br"
          summary="Starter, grower, finisher and maintenance rations for a typical 36‑day cycle."
        >
          <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/50 text-xs text-slate-100">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
                <tr>
                  <th className="border-b border-slate-700 px-3 py-2 text-left">
                    Description (g/kg)
                  </th>
                  <th className="border-b border-slate-700 px-3 py-2 text-left">
                    Starter BA220
                  </th>
                  <th className="border-b border-slate-700 px-3 py-2 text-left">
                    Grower BG200
                  </th>
                  <th className="border-b border-slate-700 px-3 py-2 text-left">
                    Finisher BF160
                  </th>
                  <th className="border-b border-slate-700 px-3 py-2 text-left">
                    Maintenance BO140
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-900/40">
                  <td className="border-b border-slate-800 px-3 py-2">
                    Protein (min)
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">220</td>
                  <td className="border-b border-slate-800 px-3 py-2">180</td>
                  <td className="border-b border-slate-800 px-3 py-2">160</td>
                  <td className="border-b border-slate-800 px-3 py-2">140</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Methionine (min)
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">4.4</td>
                  <td className="border-b border-slate-800 px-3 py-2">4.0</td>
                  <td className="border-b border-slate-800 px-3 py-2">3.6</td>
                  <td className="border-b border-slate-800 px-3 py-2">-</td>
                </tr>
                <tr className="bg-slate-900/40">
                  <td className="border-b border-slate-800 px-3 py-2">
                    Lysine (min)
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">11</td>
                  <td className="border-b border-slate-800 px-3 py-2">9.5</td>
                  <td className="border-b border-slate-800 px-3 py-2">9</td>
                  <td className="border-b border-slate-800 px-3 py-2">6</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Moisture (max)
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">120</td>
                  <td className="border-b border-slate-800 px-3 py-2">120</td>
                  <td className="border-b border-slate-800 px-3 py-2">120</td>
                  <td className="border-b border-slate-800 px-3 py-2">120</td>
                </tr>
                <tr className="bg-slate-900/40">
                  <td className="border-b border-slate-800 px-3 py-2">
                    Fat (min)
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">25</td>
                  <td className="border-b border-slate-800 px-3 py-2">25</td>
                  <td className="border-b border-slate-800 px-3 py-2">25</td>
                  <td className="border-b border-slate-800 px-3 py-2">25</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Crude fibre (max)
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">50</td>
                  <td className="border-b border-slate-800 px-3 py-2">50</td>
                  <td className="border-b border-slate-800 px-3 py-2">70</td>
                  <td className="border-b border-slate-800 px-3 py-2">70</td>
                </tr>
                <tr className="bg-slate-900/40">
                  <td className="border-b border-slate-800 px-3 py-2">
                    Calcium (min)
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">8</td>
                  <td className="border-b border-slate-800 px-3 py-2">7</td>
                  <td className="border-b border-slate-800 px-3 py-2">6</td>
                  <td className="border-b border-slate-800 px-3 py-2">7</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Calcium (max)
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">12</td>
                  <td className="border-b border-slate-800 px-3 py-2">12</td>
                  <td className="border-b border-slate-800 px-3 py-2">12</td>
                  <td className="border-b border-slate-800 px-3 py-2">12</td>
                </tr>
                <tr className="bg-slate-900/40">
                  <td className="border-b border-slate-800 px-3 py-2">
                    Phosphorus (min)
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">7</td>
                  <td className="border-b border-slate-800 px-3 py-2">6</td>
                  <td className="border-b border-slate-800 px-3 py-2">5</td>
                  <td className="border-b border-slate-800 px-3 py-2">5</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Salt (max)</td>
                  <td className="px-3 py-2">5</td>
                  <td className="px-3 py-2">5</td>
                  <td className="px-3 py-2">5</td>
                  <td className="px-3 py-2">12</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-slate-700/70 bg-slate-950/40 p-4 text-xs text-slate-100">
              <h3 className="text-sm font-semibold text-emerald-300">
                Feeding programs – 2 phase
              </h3>
              <ul className="space-y-1">
                <li>
                  <span className="font-semibold">Starter BA220:</span> 0–21
                  days, approx. 1.0 kg feed per bird total.
                </li>
                <li>
                  <span className="font-semibold">Grower BG200:</span> 22 days
                  to slaughter, approx. 2.5 kg feed per bird total.
                </li>
                <li>
                  <span className="font-semibold">Water:</span> clean water at
                  all times; check nipples or drinkers twice per day.
                </li>
              </ul>
            </div>
            <div className="space-y-2 rounded-xl border border-slate-700/70 bg-slate-950/40 p-4 text-xs text-slate-100">
              <h3 className="text-sm font-semibold text-emerald-300">
                Feeding programs – 3 phase
              </h3>
              <ul className="space-y-1">
                <li>
                  <span className="font-semibold">Starter BA220:</span> 0–21
                  days, ±1.0 kg feed per bird.
                </li>
                <li>
                  <span className="font-semibold">Grower BG200:</span> 21–32
                  days, ±1.2 kg feed per bird.
                </li>
                <li>
                  <span className="font-semibold">Finisher BF160:</span> 32–36
                  days, ±1.3 kg feed per bird.
                </li>
                <li>
                  <span className="font-semibold">Total feed:</span> around 3.5
                  kg per bird to slaughter; keep feed ad lib in the last week.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 space-y-1.5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">
              How to use this in Zianda Agri-Hub
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Capture each broiler batch as a{" "}
                <span className="font-semibold">livestock group</span> and link
                feed purchases as transactions so you can compare{" "}
                <span className="font-semibold">kg of feed per bird</span> with
                the guideline of ±3.5 kg.
              </li>
              <li>
                Use the{" "}
                <span className="font-semibold">burn vs yield</span> chart to
                see if higher feed spend is giving you better slaughter weights.
              </li>
              <li>
                Note any changes (e.g. heat stress, disease) in the{" "}
                <span className="font-semibold">batch notes</span> so you can
                explain why a cycle was above or below the guide.
              </li>
            </ul>
          </div>
        </ExpandableCard>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <ExpandableCard
          id="layers"
          open={openSections.layers}
          onToggle={toggle}
          title="Layers – pullets to point of lay"
          badge="Poultry"
          iconLabel="Ly"
          summary="Stage-based feeding plan for egg‑producing hens."
        >
          <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/40">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
                <tr>
                  <th className="border-b border-slate-700 px-3 py-2 text-left">
                    Stage
                  </th>
                  <th className="border-b border-slate-700 px-3 py-2 text-left">
                    Age (weeks)
                  </th>
                  <th className="border-b border-slate-700 px-3 py-2 text-left">
                    Key focus
                  </th>
                  <th className="border-b border-slate-700 px-3 py-2 text-left">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-900/40">
                  <td className="border-b border-slate-800 px-3 py-2">
                    Chick &amp; grower
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    0–16
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Growth to target body weight
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Balanced protein &amp; energy; avoid birds getting too fat.
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Pre‑lay
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    16–18
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Prepare bones for shell formation
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Gradually increase calcium; do not over‑feed energy.
                  </td>
                </tr>
                <tr className="bg-slate-900/40">
                  <td className="border-b border-slate-800 px-3 py-2">
                    Layer
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    18+
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    Egg production &amp; shell quality
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    High calcium, balanced amino acids; feed ad lib with access
                    to grit or shell where advised.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 space-y-1.5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">
              Useful checks for layers
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Record{" "}
                <span className="font-semibold">body weights at 8, 12 and 16 weeks</span>{" "}
                to see if pullets are on target before moving to pre‑lay.
              </li>
              <li>
                Log feed batches and egg numbers in Zianda so you can track{" "}
                <span className="font-semibold">feed conversion per dozen eggs</span>.
              </li>
              <li>
                When shell quality drops, check the{" "}
                <span className="font-semibold">calcium source and age</span> of
                the flock against this table.
              </li>
            </ul>
          </div>
        </ExpandableCard>

        <ExpandableCard
          id="beef"
          open={openSections.beef}
          onToggle={toggle}
          title="Beef cattle – weaners to slaughter"
          badge="Cattle"
          iconLabel="Bf"
          summary="Creep, backgrounding and finishing phases for beef animals."
        >
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Phase
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Typical duration
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Main ration
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Goal
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-3 py-2">
                  Creep feed
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  From 2–3 months
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Palatable creep pellets plus milk
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Support frame growth while calves are still on cows.
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-800 px-3 py-2">
                  Backgrounding
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Weaning to start of finishing
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Good quality roughage plus protein lick or grower ration
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Maintain steady growth; adapt animals to handling &amp; pens.
                </td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="px-3 py-2">Finisher</td>
                <td className="px-3 py-2">60–120 days</td>
                <td className="px-3 py-2">
                  Higher‑energy finisher (often 70–85% concentrate)
                </td>
                <td className="px-3 py-2">
                  Reach market condition; monitor dung and adjust step‑up
                  slowly.
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 space-y-1.5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">
              Linking beef phases to your records
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Tag weaners as a{" "}
                <span className="font-semibold">group in Livestock</span> and
                record weights every 30–60 days to see if your ration is
                reaching target daily gains.
              </li>
              <li>
                Capture lick, hay and concentrate costs to compare{" "}
                <span className="font-semibold">feed cost per kg gained</span>{" "}
                between backgrounding and finishing.
              </li>
              <li>
                Use notes to mark when animals moved from veld to feedlot so
                you can line this up with slaughter dates and prices.
              </li>
            </ul>
          </div>
        </ExpandableCard>

        <ExpandableCard
          id="dairy"
          open={openSections.dairy}
          onToggle={toggle}
          title="Dairy cows – lactation & dry period"
          badge="Cattle"
          iconLabel="Dy"
          summary="Match concentrate levels to milk yield and stage of lactation."
        >
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Stage
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Approx. period
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Concentrate strategy
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-3 py-2">
                  Early lactation
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Calving to ±70 days
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  High‑energy concentrate per litre of milk plus quality forage
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Watch for rapid loss of body condition and acidosis.
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-800 px-3 py-2">
                  Mid / late lactation
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  70–250 days in milk
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Gradually reduce concentrates as yield drops
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Keep cows on a stable ration; avoid sudden changes.
                </td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="px-3 py-2">Dry period</td>
                <td className="px-3 py-2">Last 6–8 weeks before calving</td>
                <td className="px-3 py-2">
                  Controlled energy ration with correct minerals
                </td>
                <td className="px-3 py-2">
                  Prepare udder and metabolism for next lactation; avoid cows
                  becoming over‑fat.
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 space-y-1.5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">
              Dairy monitoring ideas
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                In Zianda, record{" "}
                <span className="font-semibold">daily or weekly milk per cow</span>{" "}
                and link major ration changes so you can see the impact over
                time.
              </li>
              <li>
                Use pictures or notes to track{" "}
                <span className="font-semibold">body condition score</span>{" "}
                around calving and dry‑off.
              </li>
              <li>
                Create simple{" "}
                <span className="font-semibold">reminders for dry‑off dates</span>{" "}
                so cows always get a full 6–8 week dry period.
              </li>
            </ul>
          </div>
        </ExpandableCard>

        <ExpandableCard
          id="smallstock"
          open={openSections.smallstock}
          onToggle={toggle}
          title="Sheep & goats – breeding and lambing/kidding"
          badge="Small stock"
          iconLabel="SG"
          summary="Critical feeding windows for fertility and mothering ability."
        >
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Period
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Focus
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Example ration
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-3 py-2">
                  Flushing (before mating)
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Improve ovulation &amp; conception
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Better pasture or small grain supplement with mineral lick.
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-800 px-3 py-2">
                  Late gestation
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Support rapid foetal growth
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Good roughage plus ewe &amp; doe concentrate or energy lick.
                </td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="px-3 py-2">Early lactation / weaners</td>
                <td className="px-3 py-2">
                  Milk production and early growth of lambs / kids
                </td>
                <td className="px-3 py-2">
                  High‑quality forage with lactation lick; creep feed for
                  weaners.
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 space-y-1.5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">
              Practical tips for sheep &amp; goats
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Use the{" "}
                <span className="font-semibold">vaccination calendar</span> with
                this table so ewes/does are healthy going into mating.
              </li>
              <li>
                Record{" "}
                <span className="font-semibold">lambing/kidding percentages</span>{" "}
                by season to see whether flushing is improving conception.
              </li>
              <li>
                Link creep feed and lick purchases to your small‑stock group to
                watch feed cost per lamb or kid weaned.
              </li>
            </ul>
          </div>
        </ExpandableCard>

        <ExpandableCard
          id="pigs"
          open={openSections.pigs}
          onToggle={toggle}
          title="Pigs – smallholder herds"
          badge="Pigs"
          iconLabel="Pg"
          summary="Example stages from creep to finisher and sow rations."
        >
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Class
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Live weight / age
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Feed type
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-3 py-2">
                  Creep pigs
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  7–10 days to weaning
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Creep mash or pellets
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Offer little and often; keep feed fresh and dry.
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-800 px-3 py-2">
                  Growers
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Weaning to ±50 kg
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Grower feed ad lib
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Provide clean water; monitor growth and condition.
                </td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-3 py-2">
                  Finishers
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  50 kg to slaughter
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Finisher feed
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Adjust if pigs become too fat; avoid sudden ration changes.
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2">Sows</td>
                <td className="px-3 py-2">Gestation &amp; lactation</td>
                <td className="px-3 py-2">
                  Separate gestation and lactation rations
                </td>
                <td className="px-3 py-2">
                  Increase intake after farrowing; maintain body condition.
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 space-y-1.5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">
              Making pig records useful
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Record{" "}
                <span className="font-semibold">entry and exit weights</span> for
                each batch of growers and finishers to calculate growth per day.
              </li>
              <li>
                Track separate{" "}
                <span className="font-semibold">feed lines for sows</span> so you
                can see how much is spent on breeding animals vs slaughter pigs.
              </li>
              <li>
                Use notes to flag home‑mixed feeds and ingredients so you can
                trace problems back to a specific mix if growth drops.
              </li>
            </ul>
          </div>
        </ExpandableCard>

        <ExpandableCard
          id="cropResidues"
          open={openSections.cropResidues}
          onToggle={toggle}
          title="Crop residues – linking fields to feed"
          badge="Crops"
          iconLabel="CR"
          summary="Use maize stover, bean haulms and other residues safely in rations."
        >
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Residue
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Best use
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Animals
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Risks / tips
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-3 py-2">
                  Maize stover
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Roughage base with protein lick
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Cattle, sheep, goats
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Bale or stack dry; avoid mould; always add minerals.
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-800 px-3 py-2">
                  Bean haulms
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Protein‑richer roughage mixed with grass
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Cattle, goats, sheep
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Introduce slowly; check pods for mould and toxins.
                </td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="px-3 py-2">Fodder sorghum</td>
                <td className="px-3 py-2">
                  Silage or standing winter feed
                </td>
                <td className="px-3 py-2">Cattle mainly</td>
                <td className="px-3 py-2">
                  Watch for prussic acid on young regrowth; follow local
                  guidance.
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 space-y-1.5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">
              Planning residues as part of winter feed
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                In each crop block, record{" "}
                <span className="font-semibold">how many bales or grazing days</span>{" "}
                you took off after harvest.
              </li>
              <li>
                Link those blocks to livestock groups so you know which animals
                are relying on which fields.
              </li>
              <li>
                Use comments to note{" "}
                <span className="font-semibold">any mould or weather damage</span>{" "}
                so you avoid risky feed next season.
              </li>
            </ul>
          </div>
        </ExpandableCard>

        <ExpandableCard
          id="maize"
          open={openSections.maize}
          onToggle={toggle}
          title="Maize silage – example analysis"
          badge="Crop feed"
          iconLabel="Mz"
          summary="Typical targets when chopping maize for silage."
        >
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Parameter
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Typical target
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Why it matters
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-3 py-2">
                  Dry matter
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  300–350 g/kg
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Too wet wastes nutrients; too dry is hard to compact.
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-800 px-3 py-2">
                  Crude protein
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  70–90 g/kg DM
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Often needs extra protein from concentrates or legumes.
                </td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="px-3 py-2">pH</td>
                <td className="px-3 py-2">3.6–4.2</td>
                <td className="px-3 py-2">
                  Shows good fermentation and storage stability.
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 space-y-1.5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">
              Simple silage checklist
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Log{" "}
                <span className="font-semibold">chop date and field ID</span> in
                Zianda so you know which crop block each bunker came from.
              </li>
              <li>
                When you get a lab result, capture{" "}
                <span className="font-semibold">dry matter, protein and pH</span>{" "}
                here to compare between seasons.
              </li>
              <li>
                Note faces that heated or spoiled quickly so you can adjust
                compaction or feed‑out rate next time.
              </li>
            </ul>
          </div>
        </ExpandableCard>

        <ExpandableCard
          id="pasture"
          open={openSections.pasture}
          onToggle={toggle}
          title="Pasture blocks – grazing plans"
          badge="Crops"
          iconLabel="Ps"
          summary="Simple rotation ideas to link your crop and livestock planning."
        >
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Block
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Use
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Rest period
                </th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-900/40">
                <td className="border-b border-slate-800 px-3 py-2">A</td>
                <td className="border-b border-slate-800 px-3 py-2">
                  High‑quality grazing for milking cows or weaners
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  25–35 days
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Rotate quickly; avoid over‑grazing to protect regrowth.
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-800 px-3 py-2">B</td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Dry cows or maintenance stock
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  30–45 days
                </td>
                <td className="border-b border-slate-800 px-3 py-2">
                  Combine with crop residues or conserved roughage.
                </td>
              </tr>
              <tr className="bg-slate-900/40">
                <td className="px-3 py-2">C</td>
                <td className="px-3 py-2">
                  Rest / hay production or future grazing
                </td>
                <td className="px-3 py-2">Longer rest</td>
                <td className="px-3 py-2">
                  Record bales or grazing days in your crop blocks for winter
                  planning.
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 space-y-1.5 text-xs text-slate-200">
            <p className="font-semibold text-emerald-200">
              Using Zianda for grazing plans
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Treat each pasture block as a{" "}
                <span className="font-semibold">vegetation block</span> and
                record when herds move in and out.
              </li>
              <li>
                Compare{" "}
                <span className="font-semibold">rest periods and stocking rates</span>{" "}
                with animal performance from the Livestock page.
              </li>
              <li>
                Use the notes field to capture{" "}
                <span className="font-semibold">rainfall or irrigation events</span>{" "}
                so you can see how they affect grazing days per block.
              </li>
            </ul>
          </div>
        </ExpandableCard>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-xs text-slate-200">
        <p>
          For any ration change, make adjustments slowly over 5–7 days and keep
          water clean and easy to reach.
        </p>
        <Link
          href="/education/vaccination-calendars"
          className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/20"
        >
          Learn about vaccination calendars
        </Link>
      </div>
    </div>
  );
}

