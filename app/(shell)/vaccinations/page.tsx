"use client";

import Link from "next/link";
import { useVaccinationSchedule } from "@/lib/supabase/hooks";
import { Calendar, CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";

export default function VaccinationsPage() {
  const { data, isLoading, isError } = useVaccinationSchedule(180, 14);

  return (
    <AppPage
      hero={
        <PageHero
        eyebrow="Health"
        title="Vaccination schedule"
        description="Upcoming vaccinations for your herd in the next 90 days."
        image="/images/home/health.jpg"
        imageAlt="Livestock health and vaccination care"
        asideTitle="Herd care"
        asideNote="Stay ahead of due dates so animals stay market-ready and insured."
        actions={
        <Link href="/livestock" className="btn-secondary min-h-12">
        ← Back to livestock
        </Link>
        }
        />
      }
    >

      {isError && (
        <div className="flex items-center gap-2 rounded-xl border border-clay/30 bg-clay-soft px-4 py-3 text-sm text-clay shadow-soft">
          <CircleAlert className="h-5 w-5 shrink-0 text-clay" />
          <span>
            Could not load vaccination schedule. Check your connection or Supabase settings.
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 rounded-xl border border-stone bg-paper px-4 py-3 text-sm text-ink-muted shadow-soft">
          <Loader2 className="h-5 w-5 animate-spin text-crop" />
          <span>Loading vaccinations…</span>
        </div>
      )}

      {!isLoading && data && data.length === 0 && !isError && (
        <div className="empty-state text-sm text-ink-muted">
          <p className="font-medium text-ink">
            No vaccinations scheduled in the next 90 days.
          </p>
          <p className="mt-1 text-ink-muted">
            When you add animals with a date of birth, Zianda Agri-Hub can suggest
            Brucellosis and Anthrax dates based on age and add them here.
          </p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="surface overflow-hidden">
          <div className="flex items-center gap-2 border-b border-stone bg-paper px-4 py-3 text-sm text-ink-muted">
            <Calendar className="h-5 w-5 text-crop" />
            <span className="font-medium">
              {data.length} vaccination{data.length === 1 ? "" : "s"} scheduled
            </span>
          </div>
          <div className="max-h-[480px] overflow-auto">
            <table className="data-table">
              <thead className="bg-paper">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Animal
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Vaccine
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Age (days)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-paper">
                    <td className="whitespace-nowrap px-4 py-2 text-ink">
                      {item.scheduledDate}
                    </td>
                    <td className="px-4 py-2 text-ink">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {item.livestock?.name ??
                            item.vegetationBlock?.name ??
                            item.livestock?.externalId ??
                            item.vegetationBlock?.externalId ??
                            "Unknown asset"}
                        </span>
                        {(item.livestock?.externalId || item.vegetationBlock?.externalId) && (
                          <span className="text-xs text-ink-subtle">
                            {item.livestock
                              ? `Animal ID: ${item.livestock.externalId}`
                              : `Block ID: ${item.vegetationBlock?.externalId}`}
                          </span>
                        )}
                        {(item.livestock?.species || item.vegetationBlock?.cropType) && (
                          <span className="text-[11px] text-ink-subtle">
                            {item.livestock
                              ? `Species: ${item.livestock.species}`
                              : `Crop: ${item.vegetationBlock?.cropType}`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-ink">{item.vaccineName}</td>
                    <td className="px-4 py-2 text-ink">
                      {item.recommendedAgeDays}
                    </td>
                    <td className="px-4 py-2">
                      {item.completed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-crop-soft px-2 py-0.5 text-xs font-medium text-crop">
                          <CheckCircle2 className="h-3 w-3" />
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-wheat-soft px-2 py-0.5 text-xs font-medium text-ink">
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
        <div className="rounded-2xl border border-stone bg-paper p-4 text-sm text-ink-muted shadow-soft">
          <p className="font-semibold text-ink">Tips</p>
          <p className="mt-1 text-ink-muted">
            Keep animal dates of birth accurate so age-based vaccine schedules (like Brucellosis
            and Anthrax) are calculated correctly.
          </p>
          <p className="mt-1 text-ink-muted">
            Mark vaccines as completed in the future (UI coming next) to keep this list focused on
            what&apos;s still due.
          </p>
        </div>
        <div className="rounded-2xl border border-stone bg-paper p-4 text-sm text-ink-muted shadow-soft">
          <p className="font-semibold text-ink">What you can do next</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink-muted">
            <li>Open an animal profile from Livestock and update its health details.</li>
            <li>Add vaccination history when you capture treatments with your vet.</li>
            <li>Use the Audit report (Finances) to show compliance and care history.</li>
          </ul>
        </div>
      </div>
    </AppPage>
  );
}

