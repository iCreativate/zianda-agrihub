"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Leaf, Package, FlaskConical, Sprout, Plus, Eye, Pencil, Trash2 } from "lucide-react";

const STORAGE_KEY = "zianda_seeds";

const seedRecordFields = [
  { field: "Variety name", why: "Compare performance across seasons and blocks" },
  { field: "Supplier & batch/lot number", why: "Traceability; reorder or report issues" },
  { field: "Purchase date & quantity", why: "Stock rotation; plan orders" },
  { field: "Storage location & conditions", why: "Keep cool, dry; avoid moisture and pests" },
  { field: "Germination (if tested)", why: "Adjust seeding rate; reject poor batches" },
  { field: "Linked crop block(s)", why: "See which block got which seed in Crops" },
];

const storageGuidelines = [
  { condition: "Temperature", guideline: "Cool, stable (e.g. below 25°C); avoid heat and direct sun" },
  { condition: "Moisture", guideline: "Dry; sealed bags or bins to prevent mould and sprouting" },
  { condition: "Pests", guideline: "Rodent- and insect-proof; check regularly" },
  { condition: "Shelf life", guideline: "Use within supplier recommendation; test germination if old" },
];

export type SeedEntry = {
  id: string;
  variety: string;
  supplier: string;
  batch: string;
  quantity: string;
  storageLocation: string;
  imageUrl?: string;
  addedAt: string;
};

function getStoredSeedEntries(): SeedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function SeedsPage() {
  const [entries, setEntries] = useState<SeedEntry[]>([]);

  useEffect(() => {
    setEntries(getStoredSeedEntries());
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Seeds
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Track seed varieties, suppliers, germination, and planting records. Link seeds to your crop blocks for full traceability.
          </p>
        </div>
        <Link href="/seeds/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add seed
        </Link>
      </div>

      {entries.length > 0 && (
        <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">Your seed records ({entries.length})</h2>
          <ul className="space-y-2">
            {entries.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-950/40 px-3 py-2 text-sm">
                {e.imageUrl && (
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-slate-800">
                    <img src={e.imageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-100">{e.variety}</p>
                  <p className="text-xs text-slate-400">{e.supplier}{e.batch ? ` · Batch ${e.batch}` : ""} · {e.quantity}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/seeds/${e.id}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60" title="View">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                  <Link href={`/seeds/${e.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60" title="Edit">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.confirm("Delete this seed record?")) {
                        const next = entries.filter((x) => x.id !== e.id);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                        setEntries(next);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-950/30 px-2 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/20"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* What to record */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">What to record</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Keeping a simple seed register helps you reorder the right varieties, trace problems to a batch, and compare performance. Link seed purchases to{" "}
          <Link href="/vegetation" className="text-emerald-300 hover:underline">Crops</Link> by noting which block was planted with which seed.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/50">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Field</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {seedRecordFields.map((row, i) => (
                <tr key={row.field} className={i % 2 === 0 ? "bg-slate-900/40" : ""}>
                  <td className="border-b border-slate-800 px-3 py-2 font-medium text-slate-100">{row.field}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Storage */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Storage guidelines</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Poor storage reduces germination and can lead to disease. Follow supplier advice and use these as a baseline:
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/50">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Condition</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Guideline</th>
              </tr>
            </thead>
            <tbody>
              {storageGuidelines.map((row, i) => (
                <tr key={row.condition} className={i % 2 === 0 ? "bg-slate-900/40" : ""}>
                  <td className="border-b border-slate-800 px-3 py-2 font-medium text-slate-100">{row.condition}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.guideline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Germination testing */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Germination testing</h2>
        </div>
        <p className="text-xs text-slate-300 mb-2">
          For important seed (e.g. expensive or carry-over), a simple germination test helps you adjust seeding rate or reject a batch. Place a counted number of seeds on moist paper towel in a sealed bag; keep warm and count how many germinate after a few days. Percentage = (germinated ÷ total) × 100. Increase seeding rate if germination is below standard (e.g. &lt;80% for many crops).
        </p>
        <p className="text-xs text-slate-400">
          Record the result in your seed register and on the crop block in{" "}
          <Link href="/vegetation" className="text-emerald-300 hover:underline">Crops</Link> if you use that batch for planting.
        </p>
      </section>

      {/* Ordering & linking to crops */}
      <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 px-4 py-4 text-sm text-slate-200">
        <div className="flex gap-2">
          <Sprout className="h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-semibold text-slate-50">Ordering & linking to Crops</p>
            <p className="mt-1 text-xs text-slate-300">
              Plan orders around planting dates and storage capacity. When you plant, note the variety and batch on the crop block in{" "}
              <Link href="/vegetation" className="text-emerald-300 hover:underline">Crops</Link> so you can later compare yield and quality by variety. Add seed purchases as transactions in{" "}
              <Link href="/finances" className="text-emerald-300 hover:underline">Finances</Link> and link to the relevant crop block if your setup allows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
