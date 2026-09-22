"use client";

import Link from "next/link";
import { useLineageOverview } from "@/lib/supabase/hooks";
import { PawPrint, CircleAlert, Loader2 } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";

export default function LineagePage() {
  const { data, isLoading, isError } = useLineageOverview();

  return (
    <AppPage
      hero={
        <PageHero
        eyebrow="Breeding"
        title="Lineage & parentage"
        description="How calves link to their sire and dam for breeding and traceability."
        image="/images/home/sheep.jpg"
        imageAlt="Breeding stock on the veld"
        asideTitle="Bloodlines"
        asideNote="Link calves to sire and dam so breeding decisions stay traceable."
        actions={
          <Link href="/livestock" className="btn-secondary min-h-12">
            ← Back to livestock
          </Link>
        }
      />
      }
    >
      {isError && (
        <div className="flex items-center gap-2 alert-error">
          <CircleAlert className="h-5 w-5 shrink-0" />
          <span>
            Could not load lineage information. Check your connection or Supabase settings.
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 surface px-4 py-3 text-sm text-ink-muted">
          <Loader2 className="h-5 w-5 animate-spin text-ink-subtle" />
          <span>Loading lineage…</span>
        </div>
      )}

      {!isLoading && data && data.length === 0 && !isError && (
        <div className="empty-state text-sm text-ink-muted">
          <PawPrint className="mx-auto h-10 w-10 text-ink-muted" />
          <h2 className="mt-3 text-lg font-semibold text-ink">
            No lineage records yet
          </h2>
          <p className="mt-2">
            When you record calves and link them to sire and dam, they will appear here so you
            can follow bloodlines and improve breeding decisions.
          </p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="surface overflow-hidden">
          <div className="max-h-[480px] overflow-auto">
            <table className="data-table">
              <thead className="bg-ivory">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Calf
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Parent
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Relationship
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-ivory-deep">
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-ink">
                          {row.child?.name ?? row.child?.externalId ?? "Unknown"}
                        </span>
                        {row.child?.externalId && (
                          <span className="text-xs text-ink-subtle">
                            ID: {row.child.externalId}
                          </span>
                        )}
                        {row.child?.species && (
                          <span className="text-xs text-ink-subtle">
                            Species: {row.child.species}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-ink">
                          {row.parent?.name ?? row.parent?.externalId ?? "Unknown"}
                        </span>
                        {row.parent?.externalId && (
                          <span className="text-xs text-ink-subtle">
                            ID: {row.parent.externalId}
                          </span>
                        )}
                        {row.parent?.species && (
                          <span className="text-xs text-ink-subtle">
                            Species: {row.parent.species}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-ink">
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
        <div className="surface p-5 text-sm text-ink-muted">
          <p className="font-semibold text-ink">Using lineage data</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Identify which sires and dams are producing your best-performing calves.</li>
            <li>Avoid close inbreeding by checking relationships before pairing animals.</li>
            <li>Share traceability information with buyers who care about bloodlines.</li>
          </ul>
        </div>
        <div className="surface p-5 text-sm text-ink-muted">
          <p className="font-semibold text-ink">What you can do next</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Use the Add animal form to link new calves to their sire and dam.</li>
            <li>Update animal profiles with notes about fertility, milk, or growth.</li>
            <li>Combine this with Finances to see which bloodlines are most profitable.</li>
          </ul>
        </div>
      </div>
    </AppPage>
  );
}

