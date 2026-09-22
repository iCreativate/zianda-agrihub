"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QRCodeCanvas } from "qrcode.react";
import {
  Camera,
  ChevronLeft,
  QrCode,
  Scale,
  Syringe,
  HeartPulse,
  NotebookPen,
  PawPrint
} from "lucide-react";
import {
  useAnimalHealthTimeline,
  useAnimalLineage,
  useAnimalSchedule,
  useAnimalVaccinationRecords,
  useLivestockList
} from "@/lib/supabase/hooks";
import { getSupabaseClient } from "@/lib/supabase/client";
import { uploadItemImage } from "@/lib/supabase/upload";
import { LivestockKnowledgePanel } from "@/components/ui/LivestockKnowledgePanel";
import { QrDownloadAs } from "@/components/scan/qr-download-as";
import {
  animalAgeLabel,
  animalStatus,
  speciesImage,
  speciesLabel
} from "@/lib/livestock/metrics";
import {
  encodeTimelineNotes,
  recoveryLabel,
  type RecoveryStatus
} from "@/lib/livestock/timeline-notes";
import {
  appendWeightPoint,
  readWeightHistory,
  type WeightPoint
} from "@/lib/livestock/weight-history";

export function AnimalProfile(props: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useLivestockList();
  const animal = (data ?? []).find((a) => a.id === props.id);

  const timeline = useAnimalHealthTimeline(animal?.id ?? null);
  const schedule = useAnimalSchedule(animal?.id ?? null);
  const records = useAnimalVaccinationRecords(animal?.id ?? null);
  const lineage = useAnimalLineage(animal?.id ?? null);
  const herdSchedule = schedule;

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [notes, setNotes] = useState("");
  const [observation, setObservation] = useState("");
  const [treatment, setTreatment] = useState("");
  const [recoveryStatus, setRecoveryStatus] = useState<RecoveryStatus>("monitoring");
  const [saving, setSaving] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weights, setWeights] = useState<WeightPoint[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!animal) return;
    setName(animal.name ?? "");
    setBreed(animal.breed ?? "");
    setWeightKg(animal.weightKg !== undefined ? String(animal.weightKg) : "");
    const existing = readWeightHistory(animal.id);
    if (existing.length === 0 && animal.weightKg !== undefined) {
      setWeights(appendWeightPoint(animal.id, animal.weightKg, animal.updatedAt || animal.createdAt));
    } else {
      setWeights(existing);
    }
  }, [animal]);

  const status = useMemo(
    () => (animal ? animalStatus(animal.id, herdSchedule.data ?? []) : null),
    [animal, herdSchedule.data]
  );

  if (isLoading) {
    return <p className="text-sm text-ink-muted">Loading animal…</p>;
  }

  if (!animal) {
    return (
      <div className="space-y-4">
        <Link href="/livestock" className="link-quiet">
          ← Back to livestock
        </Link>
        <p className="text-sm text-ink-muted">Animal not found.</p>
      </div>
    );
  }

  const a = animal;
  const hero = a.photoUrl || speciesImage(a.species);
  const qrValue = a.qrCode || a.externalId || a.id;
  const scanUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/scan/${encodeURIComponent(qrValue)}`
      : `/scan/${encodeURIComponent(qrValue)}`;

  const historyEvents = buildHistory({
    createdAt: a.createdAt,
    schedule: schedule.data ?? [],
    records: records.data ?? [],
    timeline: timeline.data ?? [],
    weights
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      const nextWeight = weightKg ? Number(weightKg) : null;
      const { error: updateError } = await supabase
        .from("livestock")
        .update({
          name: name.trim() || a.externalId,
          breed: breed.trim() || null,
          weight_kg: nextWeight
        })
        .eq("id", a.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      if (nextWeight !== null && Number.isFinite(nextWeight)) {
        const next = appendWeightPoint(a.id, nextWeight);
        setWeights(next);
      }

      await queryClient.invalidateQueries({ queryKey: ["livestock-list"] });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update animal.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this animal and its related records? This cannot be undone.")) {
      return;
    }
    setError(null);
    setDeleting(true);
    try {
      const supabase = getSupabaseClient();
      const { error: deleteError } = await supabase.from("livestock").delete().eq("id", a.id);
      if (deleteError) {
        setError(deleteError.message);
        setDeleting(false);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["livestock-list"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      router.push("/livestock");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete animal.");
      setDeleting(false);
    }
  }

  async function handlePhoto(file: File) {
    setError(null);
    setCapturing(true);
    try {
      const url = await uploadItemImage(file, "livestock", a.id);
      const supabase = getSupabaseClient();
      const payload = encodeTimelineNotes({
        observation: observation.trim() || undefined,
        treatment: treatment.trim() || undefined,
        recoveryStatus,
        note: notes.trim() || undefined,
        weightKg: weightKg ? Number(weightKg) : undefined
      });

      const { error: photoError } = await supabase
        .from("livestock")
        .update({ photo_url: url })
        .eq("id", a.id);
      if (photoError) throw photoError;

      const { error: timelineError } = await supabase.from("health_timeline_photos").insert({
        asset_type: "livestock",
        asset_id: a.id,
        photo_url: url,
        notes: payload,
        captured_at: new Date().toISOString()
      });
      if (timelineError) throw timelineError;

      setObservation("");
      setTreatment("");
      setNotes("");
      setRecoveryStatus("monitoring");
      await queryClient.invalidateQueries({ queryKey: ["livestock-list"] });
      await queryClient.invalidateQueries({ queryKey: ["health-timeline", "livestock", a.id] });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save photo. Check storage permissions and try again."
      );
    } finally {
      setCapturing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/livestock" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink">
          <ChevronLeft className="h-4 w-4" />
          Herd
        </Link>
        <div className="flex gap-2">
          <Link href="/scan" className="btn-secondary min-h-11">
            <QrCode className="h-4 w-4" />
            Scan an animal
          </Link>
          <button type="button" onClick={handleDelete} disabled={deleting} className="btn-danger min-h-11 disabled:opacity-60">
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-card border border-stone/90 bg-ink shadow-soft">
        <div className="relative min-h-[240px] md:min-h-[320px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt={a.name || a.externalId} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/82 via-ink/45 to-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/15" />
          <div className="relative flex min-h-[240px] flex-col justify-end gap-4 p-5 text-paper md:min-h-[320px] md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-wheat">
                  {speciesLabel(a.species)}
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                  {a.name || a.externalId}
                </h1>
                <p className="mt-2 text-sm text-paper/75">
                  ID {a.externalId}
                  {a.breed ? ` · ${a.breed}` : ""}
                </p>
              </div>
              {status && (
                <span
                  className={`inline-flex rounded-control px-3 py-1.5 text-xs font-semibold ${
                    status.tone === "crop"
                      ? "bg-crop-soft text-crop"
                      : status.tone === "clay"
                        ? "bg-clay-soft text-clay"
                        : "bg-wheat-soft text-ink"
                  }`}
                >
                  {status.label}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <HeaderStat label="Breed" value={a.breed || "—"} />
              <HeaderStat label="Sex" value="Not recorded" />
              <HeaderStat label="Age" value={animalAgeLabel(a.dateOfBirth)} />
              <HeaderStat
                label="Weight"
                value={a.weightKg !== undefined ? `${a.weightKg.toFixed(1)} kg` : "—"}
              />
            </div>
          </div>
        </div>
      </section>

      {error && <div className="alert-error">{error}</div>}

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-5">
          <Panel title="Health" icon={HeartPulse}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat
                label="Open tasks"
                value={String((schedule.data ?? []).filter((i) => !i.completed).length)}
              />
              <Stat
                label="Overdue"
                value={String(
                  (schedule.data ?? []).filter(
                    (i) => !i.completed && i.scheduledDate < new Date().toISOString().slice(0, 10)
                  ).length
                )}
              />
              <Stat label="Photos" value={String((timeline.data ?? []).length)} />
            </div>
            {(schedule.data ?? []).filter((i) => !i.completed).slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="mt-3 flex min-h-11 items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2.5"
              >
                <span className="text-sm font-medium">{item.vaccineName}</span>
                <span className="text-xs text-ink-subtle">{item.scheduledDate}</span>
              </div>
            ))}
            {(schedule.data ?? []).filter((i) => !i.completed).length === 0 && (
              <p className="mt-3 text-sm text-ink-muted">No open health tasks.</p>
            )}
          </Panel>

          <Panel title="Vaccinations" icon={Syringe}>
            {(records.data ?? []).length === 0 && (schedule.data ?? []).length === 0 && (
              <p className="text-sm text-ink-muted">No vaccination records yet.</p>
            )}
            <div className="space-y-2">
              {(records.data ?? []).map((item) => (
                <div key={item.id} className="rounded-control border border-stone bg-ivory px-3 py-2.5">
                  <p className="text-sm font-medium">{item.vaccineName}</p>
                  <p className="text-xs text-ink-subtle">
                    {item.administeredDate
                      ? `Given ${item.administeredDate}`
                      : `Scheduled ${item.scheduledDate}`}
                    {item.veterinarian ? ` · ${item.veterinarian}` : ""}
                  </p>
                </div>
              ))}
              {(schedule.data ?? []).map((item) => (
                <div key={item.id} className="rounded-control border border-stone bg-ivory px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{item.vaccineName}</p>
                    <span className={item.completed ? "badge-crop" : "badge-wheat"}>
                      {item.completed ? "Done" : "Due"}
                    </span>
                  </div>
                  <p className="text-xs text-ink-subtle">{item.scheduledDate}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Treatments & photo capture" icon={Camera}>
            <p className="text-sm text-ink-muted">
              Take a photo in the kraal. Add what you see, any treatment, and recovery status.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Observation">
                <input
                  className="input-field"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="e.g. Limping left hind"
                />
              </Field>
              <Field label="Treatment">
                <input
                  className="input-field"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="e.g. Antibiotics day 1"
                />
              </Field>
              <Field label="Recovery">
                <select
                  className="input-field"
                  value={recoveryStatus}
                  onChange={(e) => setRecoveryStatus(e.target.value as RecoveryStatus)}
                >
                  <option value="monitoring">Monitoring</option>
                  <option value="recovering">Recovering</option>
                  <option value="recovered">Recovered</option>
                  <option value="critical">Critical</option>
                </select>
              </Field>
              <Field label="Extra note">
                <input
                  className="input-field"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional"
                />
              </Field>
            </div>
            <label className="btn-primary mt-4 inline-flex min-h-12 cursor-pointer">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                disabled={capturing}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handlePhoto(file);
                }}
              />
              <Camera className="h-4 w-4" />
              {capturing ? "Saving photo…" : "Capture photo"}
            </label>
          </Panel>

          <Panel title="Visual health timeline" icon={HeartPulse}>
            {(timeline.data ?? []).length === 0 ? (
              <p className="text-sm text-ink-muted">
                No health photos yet. Capture one above to start the timeline.
              </p>
            ) : (
              <div className="space-y-3">
                {(timeline.data ?? []).map((entry) => (
                  <article
                    key={entry.id}
                    className="grid gap-3 rounded-control border border-stone bg-ivory p-3 sm:grid-cols-[112px_minmax(0,1fr)]"
                  >
                    <div className="aspect-square overflow-hidden rounded-control bg-stone">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.photoUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-ink">
                          {new Date(entry.capturedAt).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                        <span className="badge-sky">{recoveryLabel(entry.recoveryStatus)}</span>
                      </div>
                      {entry.observation && (
                        <p className="text-sm text-ink">
                          <span className="text-ink-subtle">Observation · </span>
                          {entry.observation}
                        </p>
                      )}
                      {entry.treatment && (
                        <p className="text-sm text-ink">
                          <span className="text-ink-subtle">Treatment · </span>
                          {entry.treatment}
                        </p>
                      )}
                      {entry.notes && entry.notes !== entry.observation && (
                        <p className="text-xs text-ink-muted">{entry.notes}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Weight history" icon={Scale}>
            {weights.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Save a weight below to start the weigh-in history on this device.
              </p>
            ) : (
              <div className="space-y-2">
                {[...weights].reverse().map((point) => (
                  <div
                    key={`${point.date}-${point.kg}`}
                    className="flex min-h-11 items-center justify-between rounded-control border border-stone bg-ivory px-3 py-2"
                  >
                    <span className="text-sm text-ink">
                      {new Date(point.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{point.kg.toFixed(1)} kg</span>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Breeding" icon={PawPrint}>
            {(lineage.data ?? []).length === 0 ? (
              <p className="text-sm text-ink-muted">
                No sire or dam linked. Add lineage when registering calves.
              </p>
            ) : (
              <div className="space-y-2">
                {(lineage.data ?? []).map((row) => (
                  <div
                    key={row.id}
                    className="flex min-h-11 items-center justify-between rounded-control border border-stone bg-ivory px-3 py-2"
                  >
                    <span className="text-sm capitalize text-ink-subtle">{row.relationship}</span>
                    <span className="text-sm font-medium text-ink">
                      {row.parent?.name || row.parent?.externalId || "Unknown"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link href="/lineage" className="link-quiet mt-3 inline-flex">
              Open lineage
            </Link>
          </Panel>

          <Panel title="Notes & details" icon={NotebookPen}>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Name">
                  <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Breed">
                  <input className="input-field" value={breed} onChange={(e) => setBreed(e.target.value)} />
                </Field>
                <Field label="Current weight (kg)">
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                  />
                </Field>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-subtle">
                <div>
                  {a.dateOfBirth && <p>DOB: {a.dateOfBirth}</p>}
                  <p>QR ID: {qrValue}</p>
                </div>
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </Panel>

          <Panel title="History" icon={NotebookPen}>
            {historyEvents.length === 0 ? (
              <p className="text-sm text-ink-muted">No events recorded yet.</p>
            ) : (
              <ol className="relative space-y-4 border-l border-stone pl-4">
                {historyEvents.map((event) => (
                  <li key={event.id} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-ink" />
                    <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
                      {event.date}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">{event.title}</p>
                    {event.detail && <p className="text-xs text-ink-muted">{event.detail}</p>}
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>

        <aside className="space-y-5">
          <div className="surface p-5 text-center">
            <p className="section-eyebrow">QR code</p>
            <div className="mx-auto mt-4 inline-flex rounded-control border border-stone bg-paper p-3">
              <QRCodeCanvas value={scanUrl} size={160} includeMargin level="H" />
            </div>
            <p className="mt-3 text-xs text-ink-subtle">Scan to open this animal</p>
            <p className="mt-1 font-mono text-sm font-medium text-ink">{qrValue}</p>
            <QrDownloadAs
              fullWidth
              className="mt-4"
              value={scanUrl}
              filenameBase={`zianda-qr-${qrValue}`}
              meta={{
                label: a.name || a.externalId,
                detail: `${speciesLabel(a.species)}${a.breed ? ` · ${a.breed}` : ""}`,
                qrValue,
                scanUrl
              }}
            />
            <Link href="/scan" className="btn-secondary mt-2 inline-flex min-h-11 w-full">
              <QrCode className="h-4 w-4" />
              Scan an animal
            </Link>
          </div>
          <LivestockKnowledgePanel species={a.species} breed={a.breed} />
        </aside>
      </section>
    </div>
  );
}

function HeaderStat(props: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-paper/60">{props.label}</p>
      <p className="mt-1 text-sm font-medium text-paper">{props.value}</p>
    </div>
  );
}

function Panel(props: {
  title: string;
  icon: typeof HeartPulse;
  children: React.ReactNode;
}) {
  const Icon = props.icon;
  return (
    <section className="surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-ink-subtle" />
        <h2 className="text-base font-semibold tracking-tight">{props.title}</h2>
      </div>
      {props.children}
    </section>
  );
}

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-field">{props.label}</span>
      <div className="mt-1.5">{props.children}</div>
    </label>
  );
}

function Stat(props: { label: string; value: string }) {
  return (
    <div className="rounded-control border border-stone bg-ivory px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wider text-ink-subtle">{props.label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{props.value}</p>
    </div>
  );
}

function buildHistory(input: {
  createdAt: string;
  schedule: Array<{ id: string; vaccineName: string; scheduledDate: string; completed: boolean }>;
  records: Array<{ id: string; vaccineName: string; scheduledDate: string; administeredDate?: string }>;
  timeline: Array<{
    id: string;
    capturedAt: string;
    observation?: string;
    treatment?: string;
    recoveryStatus?: RecoveryStatus;
  }>;
  weights: WeightPoint[];
}) {
  const events: Array<{ id: string; date: string; title: string; detail?: string; sort: number }> = [];

  events.push({
    id: "registered",
    date: new Date(input.createdAt).toLocaleDateString(),
    title: "Registered on farm",
    sort: new Date(input.createdAt).getTime()
  });

  for (const item of input.schedule) {
    events.push({
      id: `sched-${item.id}`,
      date: item.scheduledDate,
      title: item.completed ? `Vaccination completed: ${item.vaccineName}` : `Vaccination due: ${item.vaccineName}`,
      sort: new Date(item.scheduledDate).getTime()
    });
  }

  for (const item of input.records) {
    const when = item.administeredDate || item.scheduledDate;
    events.push({
      id: `rec-${item.id}`,
      date: when,
      title: `Treatment / vaccine: ${item.vaccineName}`,
      sort: new Date(when).getTime()
    });
  }

  for (const item of input.timeline) {
    events.push({
      id: `photo-${item.id}`,
      date: new Date(item.capturedAt).toLocaleDateString(),
      title: item.observation || "Health photo captured",
      detail: [item.treatment, item.recoveryStatus ? recoveryLabel(item.recoveryStatus) : null]
        .filter(Boolean)
        .join(" · "),
      sort: new Date(item.capturedAt).getTime()
    });
  }

  for (const point of input.weights) {
    events.push({
      id: `wt-${point.date}`,
      date: new Date(point.date).toLocaleDateString(),
      title: `Weighed ${point.kg.toFixed(1)} kg`,
      sort: new Date(point.date).getTime()
    });
  }

  return events.sort((a, b) => b.sort - a.sort).slice(0, 40);
}
