"use client";

import Link from "next/link";
import { useLineageOverview } from "@/lib/supabase/hooks";
import { PawPrint, CircleAlert, Loader2 } from "lucide-react";

export default function LineagePage() {
  const { data, isLoading, isError } = useLineageOverview();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Lineage & parentage
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            How calves link to their sire and dam for breeding and traceability.
          </p>
        </div>
        <Link
          href="/livestock"
          className="text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          ← Back to livestock
        </Link>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <CircleAlert className="h-5 w-5 shrink-0" />
          <span>
            Could not load lineage information. Check your connection or Supabase settings.
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          <span>Loading lineage…</span>
        </div>
      )}

      {!isLoading && data && data.length === 0 && !isError && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          <PawPrint className="mx-auto h-10 w-10 text-slate-300" />
          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            No lineage records yet
          </h2>
          <p className="mt-2">
            When you record calves and link them to sire and dam, they will appear here so you
            can follow bloodlines and improve breeding decisions.
          </p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="max-h-[480px] overflow-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Calf
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Parent
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Relationship
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {row.child?.name ?? row.child?.externalId ?? "Unknown"}
                        </span>
                        {row.child?.externalId && (
                          <span className="text-xs text-slate-500">
                            ID: {row.child.externalId}
                          </span>
                        )}
                        {row.child?.species && (
                          <span className="text-xs text-slate-500">
                            Species: {row.child.species}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {row.parent?.name ?? row.parent?.externalId ?? "Unknown"}
                        </span>
                        {row.parent?.externalId && (
                          <span className="text-xs text-slate-500">
                            ID: {row.parent.externalId}
                          </span>
                        )}
                        {row.parent?.species && (
                          <span className="text-xs text-slate-500">
                            Species: {row.parent.species}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-slate-800">
                      {row.relationship === "sire" ? "Sire (father)" : "Dam (mother)"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Using lineage data</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Identify which sires and dams are producing your best-performing calves.</li>
            <li>Avoid close inbreeding by checking relationships before pairing animals.</li>
            <li>Share traceability information with buyers who care about bloodlines.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">What you can do next</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Use the Add animal form to link new calves to their sire and dam.</li>
            <li>Update animal profiles with notes about fertility, milk, or growth.</li>
            <li>Combine this with Finances to see which bloodlines are most profitable.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

