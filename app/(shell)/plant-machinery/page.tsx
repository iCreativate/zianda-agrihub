"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cog, Calendar, AlertCircle, Plus, Eye, Pencil, Trash2 } from "lucide-react";

const STORAGE_KEY = "zianda_plant_machinery";

const equipmentCategories = [
  { type: "Tractors & harvesters", use: "Ploughing, planting, harvesting", maintenance: "Oil, filters, belts; annual service" },
  { type: "Irrigation systems", use: "Pivots, drip, sprinklers", maintenance: "Filters, nozzles, pressure checks" },
  { type: "Generators & pumps", use: "Backup power, borehole, transfer", maintenance: "Oil, fuel stabiliser, run monthly" },
  { type: "Silos & storage", use: "Grain, feed, chemicals", maintenance: "Seals, ventilation, pest checks" },
];

const maintenanceSchedule = [
  { frequency: "Daily", items: "Visual check for leaks, odd noises, tyre pressure (if in use)" },
  { frequency: "Weekly", items: "Oil level, coolant, fuel filters; clean air intakes" },
  { frequency: "Monthly", items: "Grease points, battery, belts; run standby generators" },
  { frequency: "Annually", items: "Full service, hydraulic fluid, calibration; log in Finances" },
];

export type PlantMachineryEntry = {
  id: string;
  name: string;
  type: string;
  notes: string;
  imageUrl?: string;
  addedAt: string;
};

function getStoredEntries(): PlantMachineryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function PlantMachineryPage() {
  const [entries, setEntries] = useState<PlantMachineryEntry[]>([]);

  useEffect(() => {
    setEntries(getStoredEntries());
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Plant and machinery
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Track tractors, harvesters, irrigation systems, and other farm equipment. Plan maintenance and link costs to your finances.
          </p>
        </div>
        <Link href="/plant-machinery/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add equipment
        </Link>
      </div>

      {entries.length > 0 && (
        <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">Your equipment ({entries.length})</h2>
          <ul className="space-y-2">
            {entries.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-950/40 px-3 py-2 text-sm">
                {e.imageUrl && (
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-slate-800">
                    <img src={e.imageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-100">{e.name}</p>
                  <p className="text-xs text-slate-400">{e.type} {e.notes ? ` · ${e.notes}` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/plant-machinery/${e.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60"
                    title="View"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>
                  <Link
                    href={`/plant-machinery/${e.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.confirm("Delete this equipment?")) {
                        const next = entries.filter((x) => x.id !== e.id);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                        setEntries(next);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-950/30 px-2 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/20"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Equipment categories */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Cog className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Equipment categories</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Use this list as a checklist. Record each major item (make, model, year) in a notebook or spreadsheet, and log repairs and services in{" "}
          <Link href="/finances" className="text-emerald-300 hover:underline">Finances</Link> so your burn vs yield stays accurate.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/50">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Type</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Typical use</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Maintenance focus</th>
              </tr>
            </thead>
            <tbody>
              {equipmentCategories.map((row, i) => (
                <tr key={row.type} className={i % 2 === 0 ? "bg-slate-900/40" : ""}>
                  <td className="border-b border-slate-800 px-3 py-2 font-medium text-slate-100">{row.type}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.use}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.maintenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Maintenance schedule */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Maintenance schedule</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Sticking to a schedule reduces breakdowns and extends equipment life. Set reminders on your phone or calendar for weekly and monthly checks.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/50">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Frequency</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">What to do</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceSchedule.map((row, i) => (
                <tr key={row.frequency} className={i % 2 === 0 ? "bg-slate-900/40" : ""}>
                  <td className="border-b border-slate-800 px-3 py-2 font-medium text-slate-100">{row.frequency}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cost tracking tip */}
      <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 px-4 py-4 text-sm text-slate-200">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-semibold text-slate-50">Link machinery costs to Finances</p>
            <p className="mt-1 text-xs text-slate-300">
              When you pay for fuel, repairs, or services, add a transaction in{" "}
              <Link href="/finances/new" className="text-emerald-300 hover:underline">Finances</Link> and use a category like &quot;Equipment&quot; or &quot;Machinery&quot;. Your dashboard burn vs yield will include these costs so you see the full picture of farm spend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
