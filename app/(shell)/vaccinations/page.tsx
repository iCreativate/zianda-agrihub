"use client";

import Link from "next/link";
import { useVaccinationSchedule } from "@/lib/supabase/hooks";
import { Calendar, CheckCircle2, CircleAlert, Loader2 } from "lucide-react";

export default function VaccinationsPage() {
  const { data, isLoading, isError } = useVaccinationSchedule(180, 14);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Vaccination schedule
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Upcoming vaccinations for your herd in the next 90 days.
          </p>
        </div>
        <Link
          href="/livestock"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          ← Back to livestock
        </Link>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/60 bg-red-950/50 px-4 py-3 text-sm text-red-50 shadow-md shadow-red-900/40">
          <CircleAlert className="h-5 w-5 shrink-0 text-red-300" />
          <span>
            Could not load vaccination schedule. Check your connection or Supabase settings.
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 shadow-md shadow-black/40">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          <span>Loading vaccinations…</span>
        </div>
      )}

      {!isLoading && data && data.length === 0 && !isError && (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 text-sm text-slate-200 shadow-md shadow-black/40">
          <p className="font-medium text-slate-50">
            No vaccinations scheduled in the next 90 days.
          </p>
          <p className="mt-1 text-slate-300">
            When you add animals with a date of birth, Zianda Agri-Hub can suggest
            Brucellosis and Anthrax dates based on age and add them here.
          </p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-md shadow-black/40">
          <div className="flex items-center gap-2 border-b border-slate-700/60 bg-slate-900 px-4 py-3 text-sm text-slate-200">
            <Calendar className="h-5 w-5 text-emerald-300" />
            <span className="font-medium">
              {data.length} vaccination{data.length === 1 ? "" : "s"} scheduled
            </span>
          </div>
          <div className="max-h-[480px] overflow-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Animal
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Vaccine
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Age (days)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900">
                    <td className="whitespace-nowrap px-4 py-2 text-slate-100">
                      {item.scheduledDate}
                    </td>
                    <td className="px-4 py-2 text-slate-100">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {item.livestock?.name ??
                            item.vegetationBlock?.name ??
                            item.livestock?.externalId ??
                            item.vegetationBlock?.externalId ??
                            "Unknown asset"}
                        </span>
                        {(item.livestock?.externalId || item.vegetationBlock?.externalId) && (
                          <span className="text-xs text-slate-400">
                            {item.livestock
                              ? `Animal ID: ${item.livestock.externalId}`
                              : `Block ID: ${item.vegetationBlock?.externalId}`}
                          </span>
                        )}
                        {(item.livestock?.species || item.vegetationBlock?.cropType) && (
                          <span className="text-[11px] text-slate-500">
                            {item.livestock
                              ? `Species: ${item.livestock.species}`
                              : `Crop: ${item.vegetationBlock?.cropType}`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-slate-100">{item.vaccineName}</td>
                    <td className="px-4 py-2 text-slate-100">
                      {item.recommendedAgeDays}
                    </td>
                    <td className="px-4 py-2">
                      {item.completed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Due
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 text-sm text-slate-200 shadow-md shadow-black/40">
          <p className="font-semibold text-slate-50">Tips</p>
          <p className="mt-1 text-slate-300">
            Keep animal dates of birth accurate so age-based vaccine schedules (like Brucellosis
            and Anthrax) are calculated correctly.
          </p>
          <p className="mt-1 text-slate-300">
            Mark vaccines as completed in the future (UI coming next) to keep this list focused on
            what&apos;s still due.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 text-sm text-slate-200 shadow-md shadow-black/40">
          <p className="font-semibold text-slate-50">What you can do next</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-slate-300">
            <li>Open an animal profile from Livestock and update its health details.</li>
            <li>Add vaccination history when you capture treatments with your vet.</li>
            <li>Use the Audit report (Finances) to show compliance and care history.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

