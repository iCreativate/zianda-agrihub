"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Truck, Fuel, FileCheck, ShieldAlert, Calendar, Plus, Eye, Pencil, Trash2 } from "lucide-react";

const STORAGE_KEY = "zianda_motor_vehicles";

const vehicleTypes = [
  { type: "Tractor", use: "Ploughing, towing, PTO work", notes: "Log hours; service by hours or annually" },
  { type: "Bakkie / LDV", use: "Transport, deliveries, staff", notes: "Service per km; track fuel for tax" },
  { type: "Trailer", use: "Hay, grain, livestock, equipment", notes: "Brakes, lights, coupling; licence if required" },
  { type: "Harvester / combine", use: "Grain harvest", notes: "Seasonal; full service before and after season" },
];

const logbookItems = [
  { item: "Date", why: "For servicing and tax records" },
  { item: "Odometer / engine hours", why: "Schedule services and resale value" },
  { item: "Fuel (litres & cost)", why: "Cost per hectare or km; tax" },
  { item: "Purpose (e.g. planting Block A)", why: "Link to crop or livestock for reporting" },
];

export type MotorEntry = {
  id: string;
  type: string;
  makeModel: string;
  regOrSerial: string;
  notes: string;
  imageUrl?: string;
  addedAt: string;
};

function getStoredMotorEntries(): MotorEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function MotorPage() {
  const [entries, setEntries] = useState<MotorEntry[]>([]);

  useEffect(() => {
    setEntries(getStoredMotorEntries());
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Motor (agricultural vehicles)
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Manage tractors, bakkies, trailers, and other agricultural vehicles. Log fuel, servicing, and registration so costs are clear.
          </p>
        </div>
        <Link href="/motor/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add vehicle
        </Link>
      </div>

      {entries.length > 0 && (
        <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">Your vehicles ({entries.length})</h2>
          <ul className="space-y-2">
            {entries.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-950/40 px-3 py-2 text-sm">
                {e.imageUrl && (
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-slate-800">
                    <img src={e.imageUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-100">{e.type} – {e.makeModel}</p>
                  <p className="text-xs text-slate-400">{e.regOrSerial}{e.notes ? ` · ${e.notes}` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/motor/${e.id}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60" title="View">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                  <Link href={`/motor/${e.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60" title="Edit">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.confirm("Delete this vehicle?")) {
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

      {/* Vehicle types */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Vehicle types</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Keep a simple list of each vehicle (make, model, reg or serial, year). Update it when you buy or sell so your records match your fleet.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/50">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Type</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Typical use</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">What to log</th>
              </tr>
            </thead>
            <tbody>
              {vehicleTypes.map((row, i) => (
                <tr key={row.type} className={i % 2 === 0 ? "bg-slate-900/40" : ""}>
                  <td className="border-b border-slate-800 px-3 py-2 font-medium text-slate-100">{row.type}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.use}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Logbook & fuel */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Fuel className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Logbook & fuel</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          A simple logbook (paper or spreadsheet) per vehicle helps with servicing, tax, and understanding cost per hectare or per trip. Record the following:
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-950/50">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-300">
              <tr>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Log this</th>
                <th className="border-b border-slate-700 px-3 py-2 text-left">Why</th>
              </tr>
            </thead>
            <tbody>
              {logbookItems.map((row, i) => (
                <tr key={row.item} className={i % 2 === 0 ? "bg-slate-900/40" : ""}>
                  <td className="border-b border-slate-800 px-3 py-2 font-medium text-slate-100">{row.item}</td>
                  <td className="border-b border-slate-800 px-3 py-2 text-slate-300">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-300">
          Add fuel and repair costs as transactions in{" "}
          <Link href="/finances" className="text-emerald-300 hover:underline">Finances</Link> and use a category like &quot;Motor&quot; or &quot;Fuel&quot; so your dashboard reflects total farm spend.
        </p>
      </section>

      {/* Servicing & registration */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Servicing & registration</h2>
        </div>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span><strong className="text-slate-200">Service intervals:</strong> Follow manufacturer guidelines (km or hours). Set a reminder before the next due date.</span>
          </li>
          <li className="flex gap-2">
            <FileCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span><strong className="text-slate-200">Licence & roadworthy:</strong> Note renewal dates for bakkies and any trailers that need licensing.</span>
          </li>
          <li className="flex gap-2">
            <FileCheck className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            <span><strong className="text-slate-200">Insurance:</strong> Keep proof of insurance and update when vehicles change.</span>
          </li>
        </ul>
      </section>

      {/* Safety */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 px-4 py-4 text-sm text-slate-200">
        <div className="flex gap-2">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-semibold text-slate-50">Safety</p>
            <p className="mt-1 text-xs text-slate-300">
              Ensure operators are trained and authorised. Check brakes, lights, and couplings on trailers before use. Keep PTO guards in place and never step over a running driveline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
