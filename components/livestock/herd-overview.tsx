"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Camera, Plus, QrCode, PawPrint } from "lucide-react";
import { useLivestockList, useVaccinationSchedule } from "@/lib/supabase/hooks";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";
import { platformImage } from "@/lib/images/platform-images";
import { formatNumber } from "@/lib/format";
import {
  animalAgeLabel,
  animalStatus,
  computeHerdMetrics,
  speciesImage,
  speciesLabel
} from "@/lib/livestock/metrics";
import { totalWeightGain } from "@/lib/livestock/weight-history";

export function HerdOverview() {
  const { data, isLoading, isError } = useLivestockList();
  const schedule = useVaccinationSchedule(60, 14);
  const animals = data ?? [];

  const metrics = useMemo(() => {
    const gains = animals
      .map((animal) => totalWeightGain(animal.id))
      .filter((value) => value !== 0);
    return computeHerdMetrics(animals, schedule.data ?? [], gains);
  }, [animals, schedule.data]);

  return (
    <AppPage
      hero={
        <PageHero
          eyebrow="Herd"
          title="Livestock"
          description="Animals, health, and field records — built for the kraal, not a desk."
          image={platformImage("livestock").src}
          imageAlt={platformImage("livestock").alt}
          asideTitle="Field action"
          asideNote="Scan a tag to open that animal’s profile straight away."
          actions={
            <>
              <Link
                href="/scan"
                className="btn-primary min-h-12 flex-1 text-base tracking-wide"
              >
                <QrCode className="h-5 w-5" />
                Scan an animal
              </Link>
              <Link href="/livestock/new" className="btn-secondary min-h-12 flex-1">
                <Plus className="h-4 w-4" />
                Add animal
              </Link>
            </>
          }
        />
      }
    >
      {isError && (
        <p className="alert-error">
          Could not load animals. Check your connection or Supabase policies.
        </p>
      )}

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-3 lg:grid-cols-5">
        <Metric label="Total animals" value={isLoading ? "—" : formatNumber(metrics.total)} />
        <Metric label="Cattle" value={isLoading ? "—" : formatNumber(metrics.cattle)} accent="crop" />
        <Metric label="Sheep" value={isLoading ? "—" : formatNumber(metrics.sheep)} />
        <Metric label="Goats" value={isLoading ? "—" : formatNumber(metrics.goats)} />
        <Metric label="Births" value={isLoading ? "—" : formatNumber(metrics.births)} note="Last 12 months" />
        <Metric label="Deaths" value="—" note="Not recorded yet" />
        <Metric
          label="Weight gain"
          value={
            isLoading
              ? "—"
              : metrics.weightGainKg === null
                ? "—"
                : `${metrics.weightGainKg > 0 ? "+" : ""}${metrics.weightGainKg} kg`
          }
          note="From recorded weigh-ins"
          accent="sky"
        />
        <Metric
          label="Vaccinations due"
          value={isLoading || schedule.isLoading ? "—" : formatNumber(metrics.vaccinationsDue)}
          note="Next 30 days"
          accent="wheat"
        />
        <Metric
          label="Health alerts"
          value={isLoading || schedule.isLoading ? "—" : formatNumber(metrics.healthAlerts)}
          note="Overdue care"
          accent="clay"
          className="sm:col-span-1 lg:col-span-1 col-span-2"
        />
      </section>

      {!isLoading && animals.length === 0 && !isError && (
        <EmptyState
          icon={<PawPrint className="h-6 w-6" />}
          title="No animals recorded yet"
          description="Add your first animal to track breed, weight, vaccinations, and a photo health timeline. Each animal gets a QR code for the field."
          actions={
            <>
              <Link href="/livestock/new" className="btn-primary">
                <Plus className="h-4 w-4" />
                Add first animal
              </Link>
              <Link href="/scan" className="btn-secondary">
                <QrCode className="h-4 w-4" />
                Scan an animal
              </Link>
            </>
          }
        />
      )}

      {animals.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="section-eyebrow">Herd roll</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">Animals</h2>
            </div>
            <Link href="/vaccinations" className="link-quiet">
              Health calendar
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {animals.map((animal) => {
              const status = animalStatus(animal.id, schedule.data ?? []);
              const photo = animal.photoUrl || speciesImage(animal.species);
              return (
                <Link
                  key={animal.id}
                  href={`/livestock/${animal.id}`}
                  className="home-animal-card group overflow-hidden rounded-card border border-stone bg-paper shadow-soft"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={animal.name || animal.externalId}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-3 pt-10">
                      <p className="truncate text-base font-semibold text-paper">
                        {animal.name || animal.externalId}
                      </p>
                      <p className="truncate text-xs text-paper/75">
                        {speciesLabel(animal.species)}
                        {animal.breed ? ` · ${animal.breed}` : ""}
                      </p>
                    </div>
                    {!animal.photoUrl && (
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-control bg-paper/90 px-2 py-1 text-[10px] font-medium text-ink-muted">
                        <Camera className="h-3 w-3" />
                        Add photo
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 p-3 text-xs">
                    <div>
                      <p className="text-ink-subtle">ID</p>
                      <p className="truncate font-medium text-ink">{animal.externalId}</p>
                    </div>
                    <div>
                      <p className="text-ink-subtle">Age</p>
                      <p className="font-medium text-ink">{animalAgeLabel(animal.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-ink-subtle">Status</p>
                      <p
                        className={
                          status.tone === "crop"
                            ? "font-medium text-crop"
                            : status.tone === "clay"
                              ? "font-medium text-clay"
                              : "font-medium text-ink"
                        }
                      >
                        {status.label}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/vaccinations" className="surface-interactive p-4">
          <p className="text-sm font-medium text-ink">Vaccination schedule</p>
          <p className="mt-1 text-xs text-ink-muted">Due dates across the herd.</p>
        </Link>
        <Link href="/lineage" className="surface-interactive p-4">
          <p className="text-sm font-medium text-ink">Lineage</p>
          <p className="mt-1 text-xs text-ink-muted">Sire and dam links.</p>
        </Link>
        <Link href="/scan" className="surface-interactive p-4">
          <p className="text-sm font-medium text-ink">QR in the kraal</p>
          <p className="mt-1 text-xs text-ink-muted">Scan a tag, open the animal.</p>
        </Link>
      </section>
    </AppPage>
  );
}

function Metric(props: {
  label: string;
  value: string;
  note?: string;
  accent?: "crop" | "clay" | "wheat" | "sky";
  className?: string;
}) {
  const color =
    props.accent === "crop"
      ? "text-crop"
      : props.accent === "clay"
        ? "text-clay"
        : props.accent === "sky"
          ? "text-sky"
          : "text-ink";

  return (
    <div className={`bg-paper px-4 py-5 ${props.className ?? ""}`}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
        {props.label}
      </p>
      <p className={`mt-3 text-2xl font-semibold tracking-tight tabular-nums ${color}`}>
        {props.value}
      </p>
      {props.note && <p className="mt-1 text-xs text-ink-subtle">{props.note}</p>}
    </div>
  );
}
