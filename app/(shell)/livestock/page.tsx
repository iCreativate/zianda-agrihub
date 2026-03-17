"use client";

import Link from "next/link";
import { PawPrint, Plus, QrCode, Calendar } from "lucide-react";
import { useLivestockList } from "@/lib/supabase/hooks";

export default function LivestockPage() {
  const { data, isLoading, isError } = useLivestockList();
  const animals = data ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Livestock
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Manage your animals, health records, and vaccination schedules.
          </p>
        </div>
        <Link href="/livestock/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add animal
        </Link>
      </div>

      {isError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Could not load animals. Check your connection or Supabase policies.
        </p>
      )}

      {!isLoading && animals.length === 0 && !isError && (
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-8 text-center shadow-md shadow-black/40">
          <PawPrint className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold text-slate-50">
            No animals recorded yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
            Add your first animal to track species, breed, date of birth, weight,
            vaccinations, and lineage. Each animal gets a unique QR code for
            health cards in the field.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/livestock/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              Add first animal
            </Link>
            <Link href="/scan" className="btn-secondary">
              <QrCode className="h-4 w-4" />
              Scan QR code
            </Link>
          </div>
        </div>
      )}

      {animals.length > 0 && (
        <div className="group space-y-3 rounded-2xl border-2 border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition-all duration-200 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Animals ({animals.length})
            </p>
          </div>
          <div className="divide-y divide-slate-700/60">
            {animals.map((animal) => (
              <Link
                key={animal.id}
                href={`/livestock/${animal.id}`}
                className="flex items-center justify-between gap-3 py-3 transition hover:bg-slate-800/60"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-50 ring-1 ring-slate-600">
                    {(animal.name || animal.externalId || "?")
                      .toString()
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-50">
                      {animal.name || animal.externalId}
                    </p>
                    <p className="truncate text-xs text-slate-300">
                      {animal.species}
                      {animal.breed ? ` • ${animal.breed}` : ""}
                      {animal.externalId ? ` • ID: ${animal.externalId}` : ""}
                    </p>
                  </div>
                </div>
                <div className="hidden flex-col items-end gap-1 text-xs text-slate-300 sm:flex">
                  {animal.dateOfBirth && (
                    <span>DOB: {animal.dateOfBirth}</span>
                  )}
                  {animal.weightKg && (
                    <span>Weight: {animal.weightKg.toFixed(1)} kg</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/vaccinations"
          className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
        >
          <Calendar className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">Vaccination schedule</h3>
          <p className="mt-1 text-sm text-slate-300">
            When you add animals with a date of birth, we suggest vaccination
            dates (e.g. Brucellosis at 3 months, Anthrax at 6 months).
          </p>
        </Link>
        <Link
          href="/scan"
          className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
        >
          <QrCode className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">QR health cards</h3>
          <p className="mt-1 text-sm text-slate-300">
            Every animal gets a QR code. Scan it in the kraal to view its
            health card, vaccination history, and photo timeline.
          </p>
        </Link>
        <Link
          href="/lineage"
          className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg sm:col-span-2 lg:col-span-1"
        >
          <PawPrint className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">Lineage & parentage</h3>
          <p className="mt-1 text-sm text-slate-300">
            Link calves to sire and dam for breeding records and traceability.
          </p>
        </Link>
      </div>
    </div>
  );
}
