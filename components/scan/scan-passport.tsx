"use client";

import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowRight,
  Calendar,
  HeartPulse,
  PawPrint,
  Scale,
  Sprout,
  Syringe
} from "lucide-react";
import {
  useAnimalHealthTimeline,
  useAnimalLineage,
  useAnimalSchedule,
  useAnimalVaccinationRecords,
  useFieldHealthTimeline
} from "@/lib/supabase/hooks";
import {
  animalAgeLabel,
  animalStatus,
  speciesImage,
  speciesLabel
} from "@/lib/livestock/metrics";
import {
  cropImage,
  cropLabel,
  currentCropStage,
  formatHectares,
  stageProgress
} from "@/lib/crops/stages";
import { recoveryLabel } from "@/lib/livestock/timeline-notes";
import type { Livestock, VegetationBlock } from "@/types/agriculture";
import { FarmAssistantPanel } from "@/components/ui/FarmAssistantPanel";
import { QrDownloadAs } from "@/components/scan/qr-download-as";

export function LivestockScanPassport(props: { animal: Livestock }) {
  const a = props.animal;
  const timeline = useAnimalHealthTimeline(a.id);
  const schedule = useAnimalSchedule(a.id);
  const records = useAnimalVaccinationRecords(a.id);
  const lineage = useAnimalLineage(a.id);
  const status = animalStatus(a.id, schedule.data ?? []);
  const hero = a.photoUrl || speciesImage(a.species);
  const qrValue = a.qrCode || a.externalId || a.id;
  const open = (schedule.data ?? []).filter((item) => !item.completed).slice(0, 4);
  const done = (records.data ?? []).slice(0, 4);
  const photos = (timeline.data ?? []).slice(0, 6);
  const parents = lineage.data ?? [];

  const tone =
    status.tone === "crop"
      ? "bg-crop-soft text-crop"
      : status.tone === "clay"
        ? "bg-clay-soft text-clay"
        : "bg-wheat-soft text-ink";

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-card border border-stone bg-paper shadow-soft">
        <div className="relative min-h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent" />
          <div className="relative flex min-h-[200px] flex-col justify-end p-5 text-paper md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/70">
                Scanned animal
              </p>
              <span className={`rounded-control px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}>
                {status.label}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {a.name || a.externalId}
            </h1>
            <p className="mt-1 text-sm text-paper/75">
              {speciesLabel(a.species)}
              {a.breed ? ` · ${a.breed}` : ""} · Tag {a.externalId}
            </p>
          </div>
        </div>

        <div className="grid gap-px border-t border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Age" value={animalAgeLabel(a.dateOfBirth)} />
          <Stat
            label="Weight"
            value={a.weightKg !== undefined ? `${a.weightKg.toFixed(1)} kg` : "—"}
          />
          <Stat label="Date of birth" value={a.dateOfBirth || "Not recorded"} />
          <Stat
            label="On platform since"
            value={new Date(a.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-5">
          <section className="surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <Syringe className="h-4 w-4 text-ink-subtle" />
              <h2 className="text-base font-semibold tracking-tight">Vaccination & care</h2>
            </div>

            {schedule.isLoading || records.isLoading ? (
              <p className="text-sm text-ink-muted">Loading health records…</p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                    Upcoming
                  </p>
                  <ul className="mt-2 space-y-2">
                    {open.length === 0 && (
                      <li className="rounded-control bg-ivory px-3 py-3 text-sm text-ink-muted">
                        Nothing due. Health calendar is clear.
                      </li>
                    )}
                    {open.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2.5"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink">
                            {item.vaccineName}
                          </span>
                          <span className="block text-xs text-ink-subtle">Scheduled</span>
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-ink-muted">
                          {formatDate(item.scheduledDate)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                    Recorded
                  </p>
                  <ul className="mt-2 space-y-2">
                    {done.length === 0 && (
                      <li className="rounded-control bg-ivory px-3 py-3 text-sm text-ink-muted">
                        No administered vaccines logged yet.
                      </li>
                    )}
                    {done.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2.5"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink">
                            {item.vaccineName}
                          </span>
                          <span className="block text-xs text-ink-subtle">
                            {item.veterinarian || "Administered"}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-ink-muted">
                          {formatDate(item.administeredDate || item.scheduledDate)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          <section className="surface p-5">
            <div className="mb-4 flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-ink-subtle" />
              <h2 className="text-base font-semibold tracking-tight">Health timeline</h2>
            </div>
            {timeline.isLoading ? (
              <p className="text-sm text-ink-muted">Loading photos…</p>
            ) : photos.length === 0 ? (
              <p className="text-sm text-ink-muted">
                No health photos recorded for this animal yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo) => (
                  <figure
                    key={photo.id}
                    className="overflow-hidden rounded-control border border-stone bg-ivory"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.photoUrl}
                      alt=""
                      className="aspect-square w-full object-cover"
                    />
                    <figcaption className="space-y-0.5 p-2.5">
                      <p className="text-[11px] font-medium text-ink">
                        {formatDate(photo.capturedAt)}
                      </p>
                      {photo.recoveryStatus && (
                        <p className="text-[11px] text-ink-subtle">
                          {recoveryLabel(photo.recoveryStatus)}
                        </p>
                      )}
                      {(photo.observation || photo.notes) && (
                        <p className="line-clamp-2 text-[11px] text-ink-muted">
                          {photo.observation || photo.notes}
                        </p>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>

          {parents.length > 0 && (
            <section className="surface p-5">
              <div className="mb-4 flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-ink-subtle" />
                <h2 className="text-base font-semibold tracking-tight">Lineage</h2>
              </div>
              <ul className="space-y-2">
                {parents.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2.5 text-sm"
                  >
                    <span className="capitalize text-ink-muted">{row.relationship}</span>
                    <span className="font-medium text-ink">
                      {row.parent?.name || row.parent?.externalId || "Unknown parent"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <FarmAssistantPanel
            context={{
              kind: "livestock",
              species: a.species,
              ageDays: ageDaysFromDob(a.dateOfBirth)
            }}
          />
        </div>

        <aside className="space-y-4">
          <div className="surface p-5 text-center">
            <p className="section-eyebrow">Tag</p>
            <div className="mx-auto mt-4 inline-flex rounded-control border border-stone bg-paper p-3">
              <QRCodeCanvas
                value={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/scan/${encodeURIComponent(qrValue)}`
                    : `/scan/${encodeURIComponent(qrValue)}`
                }
                size={140}
                includeMargin
                level="H"
              />
            </div>
            <p className="mt-3 font-mono text-sm font-medium text-ink">{qrValue}</p>
            <p className="mt-1 text-xs text-ink-subtle">Scan opens this passport</p>
            <QrDownloadAs
              fullWidth
              className="mt-4"
              value={
                typeof window !== "undefined"
                  ? `${window.location.origin}/scan/${encodeURIComponent(qrValue)}`
                  : `/scan/${encodeURIComponent(qrValue)}`
              }
              filenameBase={`zianda-qr-${qrValue}`}
              meta={{
                label: a.name || a.externalId,
                detail: `${speciesLabel(a.species)}${a.breed ? ` · ${a.breed}` : ""}`,
                qrValue
              }}
            />
          </div>

          <div className="surface space-y-2 p-4">
            <Fact icon={Scale} label="Weight" value={a.weightKg !== undefined ? `${a.weightKg} kg` : "—"} />
            <Fact icon={Calendar} label="Age" value={animalAgeLabel(a.dateOfBirth)} />
            <Fact icon={Syringe} label="Open tasks" value={String(open.length)} />
          </div>

          <Link href={`/livestock/${a.id}`} className="btn-primary flex min-h-12 w-full">
            Open full profile
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/scan" className="btn-secondary flex min-h-11 w-full">
            Scan another tag
          </Link>
        </aside>
      </div>
    </div>
  );
}

export function VegetationScanPassport(props: { block: VegetationBlock }) {
  const b = props.block;
  const timeline = useFieldHealthTimeline(b.id);
  const stage = currentCropStage(b.cropType, b.plantingDate);
  const progress = stageProgress(b.cropType, b.plantingDate);
  const hero = b.photoUrl || cropImage(b.cropType);
  const qrValue = b.qrCode || b.externalId || b.id;
  const photos = (timeline.data ?? []).slice(0, 6);

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-card border border-stone bg-paper shadow-soft">
        <div className="relative min-h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent" />
          <div className="relative flex min-h-[200px] flex-col justify-end p-5 text-paper md:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/70">
              Scanned field
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{b.externalId}</h1>
            <p className="mt-1 text-sm text-paper/75">
              {cropLabel(b.cropType, b.variety)} · {stage.label}
            </p>
          </div>
        </div>
        <div className="grid gap-px border-t border-stone bg-stone sm:grid-cols-3">
          <Stat label="Area" value={formatHectares(b.areaHectares)} />
          <Stat label="Planted" value={b.plantingDate || "—"} />
          <Stat label="Progress" value={`${progress}%`} />
        </div>
      </section>

      <section className="surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <Sprout className="h-4 w-4 text-ink-subtle" />
          <h2 className="text-base font-semibold tracking-tight">Field photos</h2>
        </div>
        {timeline.isLoading ? (
          <p className="text-sm text-ink-muted">Loading photos…</p>
        ) : photos.length === 0 ? (
          <p className="text-sm text-ink-muted">No field photos recorded yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              <figure
                key={photo.id}
                className="overflow-hidden rounded-control border border-stone bg-ivory"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.photoUrl} alt="" className="aspect-square w-full object-cover" />
                <figcaption className="p-2.5 text-[11px] text-ink-muted">
                  {formatDate(photo.capturedAt)}
                  {photo.cropStage ? ` · ${photo.cropStage}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href={`/vegetation/${b.id}`} className="btn-primary min-h-12">
          Open field profile
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/scan" className="btn-secondary min-h-12">
          Scan another tag
        </Link>
      </div>

      <p className="text-xs text-ink-subtle">Tag ID: {qrValue}</p>
    </div>
  );
}

function Stat(props: { label: string; value: string }) {
  return (
    <div className="bg-paper px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
        {props.label}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink">{props.value}</p>
    </div>
  );
}

function Fact(props: {
  icon: typeof Scale;
  label: string;
  value: string;
}) {
  const Icon = props.icon;
  return (
    <div className="flex items-center gap-3 rounded-control bg-ivory px-3 py-2.5">
      <Icon className="h-4 w-4 text-ink-subtle" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-ink-subtle">{props.label}</p>
        <p className="text-sm font-medium text-ink">{props.value}</p>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function ageDaysFromDob(dateOfBirth?: string) {
  if (!dateOfBirth) return undefined;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return undefined;
  return Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24));
}
