"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wrench, Package, RefreshCw, AlertTriangle, Plus, Eye, Pencil, Trash2 } from "lucide-react";

const STORAGE_KEY = "zianda_tools";

const toolCategories = [
  { category: "Hand tools", examples: "Spades, forks, hoes, secateurs, wire strainers", care: "Clean, dry, sharpen; replace handles when cracked" },
  { category: "Power tools", examples: "Drills, angle grinders, chainsaws, brushcutters", care: "Check cords and guards; service blades and filters" },
  { category: "Implements", examples: "Ploughs, planters, sprayers, mowers", care: "Wash after use; grease points; store under cover" },
  { category: "Measuring & fencing", examples: "Tape, levels, wire, strainers, post drivers", care: "Keep dry; check calibration; replace worn wire" },
];

const storageTips = [
  "Store tools in a dry place to avoid rust and damage.",
  "Hang or rack frequently used items so they’re easy to find and don’t get damaged.",
  "Keep chemicals and fuels away from tools; store in a locked cabinet or separate shed.",
  "Label shelves or drawers so anyone on the farm can return tools to the right spot.",
];

export type ToolEntry = {
  id: string;
  name: string;
  category: string;
  condition: string;
  location: string;
  imageUrl?: string;
  addedAt: string;
};

function getStoredToolEntries(): ToolEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function ToolsPage() {
  const [entries, setEntries] = useState<ToolEntry[]>([]);

  useEffect(() => {
    setEntries(getStoredToolEntries());
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Tools
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Inventory of hand tools, power tools, and farm implements. Track condition, location, and when to repair or replace.
          </p>
        </div>
        <Link href="/tools/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add tool
        </Link>
      </div>

      {entries.length > 0 && (
        <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">Your tools ({entries.length})</h2>
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
                  <p className="text-xs text-slate-400">{e.category}{e.location ? ` · ${e.location}` : ""}{e.condition ? ` · ${e.condition}` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/tools/${e.id}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60" title="View">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                  <Link href={`/tools/${e.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60" title="Edit">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.confirm("Delete this tool?")) {
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

      {/* Tool categories */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Tool categories</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          A simple list by category helps you see what you have, what’s missing, and what needs attention. You can keep this in a notebook or spreadsheet and add purchase or repair costs in{" "}
          <Link href="/finances" className="text-emerald-300 hover:underline">Finances</Link>.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/50">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Category</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Examples</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Care</th>
              </tr>
            </thead>
            <tbody>
              {toolCategories.map((row, i) => (
                <tr key={row.category} className={i % 2 === 0 ? "bg-slate-900/40" : ""}>
                  <td className="border-b border-slate-800 px-3 py-2 font-medium text-slate-100">{row.category}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.examples}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.care}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Storage & condition */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Storage & condition</h2>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Good storage extends tool life and makes work faster. Use these as a checklist:
        </p>
        <ul className="space-y-2 text-xs text-slate-300">
          {storageTips.map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-emerald-400">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* When to repair or replace */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">When to repair or replace</h2>
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <p><strong className="text-slate-200">Repair</strong> when the cost is less than about half of a new item and the tool is still safe and accurate (e.g. new handle, sharpening, new blade).</p>
          <p><strong className="text-slate-200">Replace</strong> when the tool is unsafe (e.g. cracked, guard missing), beyond economic repair, or causing poor quality work (e.g. blunt blades, worn measuring tape).</p>
          <p className="text-slate-400">Log repair and replacement costs in Finances under a category like &quot;Tools&quot; or &quot;Equipment&quot; so you can see spending over time.</p>
        </div>
      </section>

      {/* Safety reminder */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 px-4 py-4 text-sm text-slate-200">
        <div className="flex gap-2">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-slate-50">Safety</p>
            <p className="mt-1 text-xs text-slate-300">
              Use PPE (gloves, goggles, boots) where needed. Ensure power tools are earthed and cords are in good condition. Keep cutting tools sharp; blunt tools cause more accidents. Store sharp and heavy items where they can’t fall or be tripped over.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
