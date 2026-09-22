"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QRCodeCanvas } from "qrcode.react";
import {
  Camera,
  ChevronLeft,
  CloudSun,
  Droplets,
  ListChecks,
  NotebookPen,
  Sprout,
  Wallet
} from "lucide-react";
import {
  useFieldHealthTimeline,
  useFieldInputSchedule,
  useFieldSoilLogs,
  useFieldTransactions,
  useVegetationList
} from "@/lib/supabase/hooks";
import { getSupabaseClient } from "@/lib/supabase/client";
import { uploadItemImage } from "@/lib/supabase/upload";
import { useFarm } from "@/lib/farm/use-farm";
import { useWeather } from "@/lib/farm/use-weather";
import { formatMoney } from "@/lib/format";
import { encodeTimelineNotes } from "@/lib/livestock/timeline-notes";
import { QrDownloadAs } from "@/components/scan/qr-download-as";
import {
  cropImage,
  cropLabel,
  cropStages,
  currentCropStage,
  daysSincePlanting,
  expectedHarvestDate,
  fieldHealth,
  formatHectares,
  stageProgress,
  type CropStageId
} from "@/lib/crops/stages";
import type { CropType } from "@/types/agriculture";

const cropTypeOptions: CropType[] = [
  "maize",
  "wheat",
  "soybean",
  "vegetable",
  "fruit",
  "forage",
  "other"
];

export function FieldDetail(props: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useVegetationList();
  const block = (data ?? []).find((b) => b.id === props.id);
  const timeline = useFieldHealthTimeline(block?.id ?? null);
  const inputs = useFieldInputSchedule(block?.id ?? null);
  const soil = useFieldSoilLogs(block?.id ?? null);
  const costs = useFieldTransactions(block?.id ?? null);
  const { farm } = useFarm();
  const weather = useWeather(farm.lat, farm.lon);

  const [externalId, setExternalId] = useState("");
  const [cropType, setCropType] = useState<CropType>("maize");
  const [customCropName, setCustomCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [areaHectares, setAreaHectares] = useState("");
  const [fieldNotes, setFieldNotes] = useState("");
  const [observation, setObservation] = useState("");
  const [cropStage, setCropStage] = useState<CropStageId>("growth");
  const [saving, setSaving] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputProduct, setInputProduct] = useState("");
  const [inputType, setInputType] = useState<"fertilizer" | "pesticide" | "herbicide">("fertilizer");
  const [inputDate, setInputDate] = useState("");
  const [addingInput, setAddingInput] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!block) return;
    setExternalId(block.externalId ?? "");
    setCropType(block.cropType ?? "maize");
    setCustomCropName(block.cropType === "other" && block.variety ? block.variety : "");
    setVariety(block.variety ?? "");
    setPlantingDate(block.plantingDate ?? "");
    setAreaHectares(block.areaHectares != null ? String(block.areaHectares) : "");
    const stage = currentCropStage(block.cropType, block.plantingDate);
    setCropStage(stage.id);
  }, [block]);

  const stage = useMemo(
    () => (block ? currentCropStage(block.cropType, block.plantingDate) : null),
    [block]
  );
  const stages = block ? cropStages(block.cropType) : [];
  const harvest = block ? expectedHarvestDate(block.cropType, block.plantingDate) : null;
  const progress = block ? stageProgress(block.cropType, block.plantingDate) : 0;
  const days = block ? daysSincePlanting(block.plantingDate) : null;
  const health = stage ? fieldHealth(stage, weather.data) : null;
  const totalCosts = (costs.data ?? []).reduce(
    (sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0),
    0
  );

  if (isLoading) {
    return <p className="text-sm text-ink-muted">Loading field…</p>;
  }

  if (!block) {
    return (
      <div className="space-y-4">
        <Link href="/vegetation" className="link-quiet">
          ← Back to crops
        </Link>
        <p className="text-sm text-ink-muted">Crop block not found.</p>
      </div>
    );
  }

  const b = block;
  const hero = b.photoUrl || cropImage(b.cropType);
  const qrValue = b.qrCode || b.externalId || b.id;
  const scanUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/scan/${encodeURIComponent(qrValue)}`
      : `/scan/${encodeURIComponent(qrValue)}`;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase
        .from("vegetation_blocks")
        .update({
          external_id: externalId.trim() || b.externalId,
          crop_type: cropType,
          variety:
            variety.trim() ||
            (cropType === "other" && customCropName.trim() ? customCropName.trim() : null),
          planting_date: plantingDate || null,
          area_hectares: areaHectares ? Number(areaHectares) : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", b.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["vegetation-list"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update field.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this crop block? This cannot be undone.")) return;
    setError(null);
    setDeleting(true);
    try {
      const supabase = getSupabaseClient();
      const { error: deleteError } = await supabase.from("vegetation_blocks").delete().eq("id", b.id);
      if (deleteError) {
        setError(deleteError.message);
        setDeleting(false);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["vegetation-list"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      router.push("/vegetation");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete field.");
      setDeleting(false);
    }
  }

  async function handlePhoto(file: File) {
    setError(null);
    setCapturing(true);
    try {
      const url = await uploadItemImage(file, "vegetation", b.id);
      const supabase = getSupabaseClient();
      const payload = encodeTimelineNotes({
        observation: observation.trim() || undefined,
        note: fieldNotes.trim() || undefined,
        cropStage
      });

      const { error: photoError } = await supabase
        .from("vegetation_blocks")
        .update({ photo_url: url, updated_at: new Date().toISOString() })
        .eq("id", b.id);
      if (photoError) throw photoError;

      const { error: timelineError } = await supabase.from("health_timeline_photos").insert({
        asset_type: "vegetation",
        asset_id: b.id,
        photo_url: url,
        notes: payload,
        captured_at: new Date().toISOString()
      });
      if (timelineError) throw timelineError;

      setObservation("");
      setFieldNotes("");
      await queryClient.invalidateQueries({ queryKey: ["vegetation-list"] });
      await queryClient.invalidateQueries({ queryKey: ["health-timeline", "vegetation", b.id] });
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

  async function handleAddInput(e: React.FormEvent) {
    e.preventDefault();
    if (!inputProduct.trim() || !inputDate) return;
    setAddingInput(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const { error: insertError } = await supabase.from("input_schedule_items").insert({
        vegetation_block_id: b.id,
        type: inputType,
        product_name: inputProduct.trim(),
        scheduled_date: inputDate,
        applied_date: inputDate
      });
      if (insertError) throw insertError;
      setInputProduct("");
      setInputDate("");
      await queryClient.invalidateQueries({ queryKey: ["input-schedule", b.id] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save input.");
    } finally {
      setAddingInput(false);
    }
  }

  const photosByStage = stages.map((item) => ({
    stage: item,
    photos: (timeline.data ?? []).filter((photo) => photo.cropStage === item.id)
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/vegetation"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" />
          Fields
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="btn-danger min-h-11 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete field"}
        </button>
      </div>

      <section className="relative overflow-hidden rounded-card border border-stone/90 bg-ink shadow-soft">
        <div className="relative min-h-[260px] md:min-h-[360px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt={b.externalId} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/82 via-ink/45 to-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/15" />
          <div className="relative flex min-h-[260px] flex-col justify-end gap-4 p-5 text-paper md:min-h-[360px] md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-wheat">
                  {cropLabel(b.cropType, b.variety)}
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                  {b.externalId}
                </h1>
                <p className="mt-2 text-sm text-paper/75">
                  {formatHectares(b.areaHectares)}
                  {b.plantingDate
                    ? ` · Planted ${new Date(b.plantingDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}`
                    : ""}
                </p>
              </div>
              {health && (
                <span
                  className={`inline-flex rounded-control px-3 py-1.5 text-xs font-semibold ${
                    health.tone === "crop"
                      ? "bg-crop-soft text-crop"
                      : health.tone === "clay"
                        ? "bg-clay-soft text-clay"
                        : health.tone === "sky"
                          ? "bg-sky-soft text-sky"
                          : "bg-wheat-soft text-ink"
                  }`}
                >
                  {health.label}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <HeaderStat label="Growth stage" value={stage?.label ?? "—"} />
              <HeaderStat label="Days in field" value={days === null ? "—" : String(days)} />
              <HeaderStat
                label="Expected harvest"
                value={
                  harvest
                    ? new Date(harvest).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric"
                      })
                    : "—"
                }
              />
              <HeaderStat label="Season progress" value={`${progress}%`} />
            </div>
          </div>
        </div>
      </section>

      {error && <div className="alert-error">{error}</div>}

      {/* Signature growth journey */}
      <section className="surface overflow-hidden p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-eyebrow">Signature timeline</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">Crop development</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Planting → Germination → Growth → Flowering → Maturity → Harvest
            </p>
          </div>
          <p className="text-xs text-ink-subtle">Day {days ?? "—"} of season</p>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[18px] hidden h-px bg-stone md:block" />
          <ol className="grid gap-4 md:grid-cols-6">
            {stages.map((item, index) => {
              const reached = stage ? stages.findIndex((s) => s.id === stage.id) >= index : false;
              const current = stage?.id === item.id;
              return (
                <li key={item.id} className="relative">
                  <div className="flex items-center gap-3 md:flex-col md:items-start">
                    <span
                      className={`relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                        current
                          ? "border-ink bg-ink text-paper"
                          : reached
                            ? "border-crop bg-crop-soft text-crop"
                            : "border-stone bg-paper text-ink-subtle"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${current ? "text-ink" : "text-ink-muted"}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-ink-subtle">Day {item.day}+</p>
                    </div>
                  </div>
                  {index < stages.length - 1 && (
                    <span className="ml-[17px] mt-1 block text-ink-subtle md:hidden" aria-hidden>
                      ↓
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-ivory-deep">
          <div className="h-full rounded-full bg-crop transition-all" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div className="space-y-5">
          <Panel title="Photo timeline" icon={Camera}>
            <p className="text-sm text-ink-muted">
              Capture the field from your phone as the crop develops. Photos are filed by growth stage.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Growth stage">
                <select
                  className="input-field"
                  value={cropStage}
                  onChange={(e) => setCropStage(e.target.value as CropStageId)}
                >
                  {stages.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Observation">
                <input
                  className="input-field"
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="e.g. Strong stand, some leaf rust"
                />
              </Field>
            </div>
            <Field label="Note">
              <input
                className="input-field mt-3"
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
                placeholder="Optional field note"
              />
            </Field>
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
              {capturing ? "Saving photo…" : "Add field photograph"}
            </label>

            <div className="mt-6 space-y-6">
              {photosByStage.every((group) => group.photos.length === 0) && (
                <p className="text-sm text-ink-muted">
                  No field photos yet. Start with planting or germination to build the season story.
                </p>
              )}
              {photosByStage.map((group) =>
                group.photos.length === 0 ? null : (
                  <div key={group.stage.id}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-crop" />
                      <h3 className="text-sm font-semibold text-ink">{group.stage.label}</h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {group.photos.map((photo) => (
                        <article
                          key={photo.id}
                          className="overflow-hidden rounded-control border border-stone bg-ivory"
                        >
                          <div className="aspect-[4/3] bg-stone">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.photoUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="space-y-1 p-3">
                            <p className="text-xs font-medium text-ink-subtle">
                              {new Date(photo.capturedAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </p>
                            {photo.observation && (
                              <p className="text-sm text-ink">{photo.observation}</p>
                            )}
                            {photo.notes && photo.notes !== photo.observation && (
                              <p className="text-xs text-ink-muted">{photo.notes}</p>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </Panel>

          <Panel title="Crop information" icon={Sprout}>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Field name / ID">
                  <input
                    className="input-field"
                    value={externalId}
                    onChange={(e) => setExternalId(e.target.value)}
                  />
                </Field>
                <Field label="Crop type">
                  <select
                    className="input-field"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value as CropType)}
                  >
                    {cropTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
                {cropType === "other" && (
                  <Field label="Custom crop name">
                    <input
                      className="input-field"
                      value={customCropName}
                      onChange={(e) => setCustomCropName(e.target.value)}
                    />
                  </Field>
                )}
                <Field label="Variety">
                  <input
                    className="input-field"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                  />
                </Field>
                <Field label="Planting date">
                  <input
                    className="input-field"
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                  />
                </Field>
                <Field label="Area (ha)">
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    step="0.0001"
                    value={areaHectares}
                    onChange={(e) => setAreaHectares(e.target.value)}
                  />
                </Field>
              </div>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "Saving…" : "Save field"}
              </button>
            </form>
          </Panel>

          <Panel title="Input usage" icon={Droplets}>
            <form onSubmit={handleAddInput} className="grid gap-3 sm:grid-cols-4">
              <Field label="Type">
                <select
                  className="input-field"
                  value={inputType}
                  onChange={(e) =>
                    setInputType(e.target.value as "fertilizer" | "pesticide" | "herbicide")
                  }
                >
                  <option value="fertilizer">Fertilizer</option>
                  <option value="pesticide">Pesticide</option>
                  <option value="herbicide">Herbicide</option>
                </select>
              </Field>
              <Field label="Product">
                <input
                  className="input-field"
                  value={inputProduct}
                  onChange={(e) => setInputProduct(e.target.value)}
                  placeholder="Product name"
                />
              </Field>
              <Field label="Date">
                <input
                  className="input-field"
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                />
              </Field>
              <div className="flex items-end">
                <button type="submit" disabled={addingInput} className="btn-secondary min-h-11 w-full">
                  {addingInput ? "Saving…" : "Log input"}
                </button>
              </div>
            </form>
            <div className="mt-4 space-y-2">
              {(inputs.data ?? []).length === 0 && (
                <p className="text-sm text-ink-muted">No inputs logged for this field yet.</p>
              )}
              {(inputs.data ?? []).map((item) => (
                <div
                  key={item.id}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium capitalize text-ink">
                      {item.type} · {item.productName}
                    </p>
                    <p className="text-xs text-ink-subtle">
                      {item.appliedDate || item.scheduledDate}
                      {item.dosage ? ` · ${item.dosage}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Tasks" icon={ListChecks}>
            <div className="space-y-2">
              {stages
                .filter((item) => {
                  if (!stage) return false;
                  const currentIndex = stages.findIndex((s) => s.id === stage.id);
                  const itemIndex = stages.findIndex((s) => s.id === item.id);
                  return itemIndex >= currentIndex && itemIndex <= currentIndex + 1;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex min-h-11 items-center justify-between rounded-control border border-stone bg-ivory px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-ink">Scout / record {item.label}</span>
                    <span className="text-xs text-ink-subtle">
                      {(timeline.data ?? []).some((p) => p.cropStage === item.id)
                        ? "Photo on file"
                        : "Needs photo"}
                    </span>
                  </div>
                ))}
              <Link href="/finances/new" className="link-quiet inline-flex pt-1">
                Log a field cost →
              </Link>
            </div>
          </Panel>

          <Panel title="Costs & yield" icon={Wallet}>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Field costs" value={formatMoney(totalCosts)} />
              <Stat
                label="Yield outlook"
                value={
                  b.areaHectares
                    ? formatMoney(
                        b.areaHectares *
                          ({
                            maize: 18000,
                            wheat: 14000,
                            soybean: 16000,
                            vegetable: 45000,
                            fruit: 52000,
                            forage: 8000,
                            other: 12000
                          }[b.cropType] ?? 12000)
                      )
                    : "—"
                }
              />
            </div>
            <div className="mt-4 space-y-2">
              {(costs.data ?? []).slice(0, 5).map((row) => (
                <div
                  key={row.id}
                  className="flex min-h-11 items-center justify-between rounded-control border border-stone bg-ivory px-3 py-2"
                >
                  <span className="text-sm text-ink">
                    {row.description || row.category} · {row.date}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">{formatMoney(row.amount)}</span>
                </div>
              ))}
              {(costs.data ?? []).length === 0 && (
                <p className="text-sm text-ink-muted">
                  No costs linked to this field. Add transactions with this block selected.
                </p>
              )}
            </div>
          </Panel>

          <Panel title="Soil & notes" icon={NotebookPen}>
            {(soil.data ?? []).length === 0 ? (
              <p className="text-sm text-ink-muted">
                No soil logs yet. Use the farmer hub or add checks when you scout.
              </p>
            ) : (
              <div className="space-y-2">
                {(soil.data ?? []).map((log) => (
                  <div
                    key={log.id}
                    className="rounded-control border border-stone bg-ivory px-3 py-2.5 text-sm"
                  >
                    <p className="font-medium text-ink">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {log.ph != null ? `pH ${log.ph}` : ""}
                      {log.moisturePercent != null
                        ? `${log.ph != null ? " · " : ""}Moisture ${log.moisturePercent}%`
                        : ""}
                    </p>
                    {log.notes && <p className="mt-1 text-xs text-ink-muted">{log.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <aside className="space-y-5">
          <div className="surface p-5">
            <p className="section-eyebrow">Weather</p>
            <div className="mt-3 flex items-center gap-2">
              <CloudSun className="h-5 w-5 text-sky" />
              <div>
                <p className="text-lg font-semibold tabular-nums">
                  {weather.data ? `${Math.round(weather.data.temperature)}°` : "—"}
                </p>
                <p className="text-xs text-ink-subtle">{weather.data?.label ?? "Local conditions"}</p>
              </div>
            </div>
            {weather.data && (
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-control bg-ivory px-2.5 py-2">
                  <dt className="text-ink-subtle">Humidity</dt>
                  <dd className="font-medium">{Math.round(weather.data.humidity)}%</dd>
                </div>
                <div className="rounded-control bg-ivory px-2.5 py-2">
                  <dt className="text-ink-subtle">Wind</dt>
                  <dd className="font-medium">{Math.round(weather.data.wind)} km/h</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="surface p-5 text-center">
            <p className="section-eyebrow">Field QR</p>
            <div className="mx-auto mt-4 inline-flex rounded-control border border-stone bg-paper p-3">
              <QRCodeCanvas value={scanUrl} size={148} includeMargin level="H" />
            </div>
            <p className="mt-3 font-mono text-sm font-medium text-ink">{qrValue}</p>
            <QrDownloadAs
              fullWidth
              className="mt-4"
              value={scanUrl}
              filenameBase={`zianda-qr-${qrValue}`}
              meta={{
                label: b.externalId,
                detail: cropLabel(b.cropType, b.variety),
                qrValue,
                scanUrl
              }}
            />
            <Link href="/scan" className="btn-secondary mt-2 inline-flex min-h-11 w-full">
              Scan in the field
            </Link>
          </div>
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
  icon: typeof Camera;
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
