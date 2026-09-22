"use client";

import { FormPage } from "@/components/shell/form-page";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ImagePlus, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import { uploadItemImage, assertImageWithinLimit, formatMaxImageSize } from "@/lib/supabase/upload";
import { encodeTimelineNotes } from "@/lib/livestock/timeline-notes";
import { currentCropStage } from "@/lib/crops/stages";
import type { CropType, VegetationBlock } from "@/types/agriculture";

const cropTypeOptions: CropType[] = [
  "maize",
  "wheat",
  "soybean",
  "vegetable",
  "fruit",
  "forage",
  "other"
];

export default function NewVegetationBlockPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [externalId, setExternalId] = useState("");
  const [cropType, setCropType] = useState<CropType>("maize");
  const [customCropName, setCustomCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [areaValue, setAreaValue] = useState<string>("");
  const [areaUnit, setAreaUnit] = useState<"ha" | "m2">("ha");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function clearImage() {
    setImageFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = getSupabaseClient();
    const baseId = externalId.trim() || `BLOCK-${Date.now()}`;

    const areaNum = areaValue ? Number(areaValue) : null;
    const areaHectares =
      areaNum != null && !Number.isNaN(areaNum)
        ? areaUnit === "m2"
          ? areaNum / 10000
          : areaNum
        : null;

    const payload = {
      external_id: baseId,
      crop_type: cropType,
      variety:
        variety.trim() ||
        (cropType === "other" && customCropName.trim() ? customCropName.trim() : null),
      planting_date: plantingDate || null,
      area_hectares: areaHectares,
      qr_code: baseId
    };

    try {
      const { data, error: insertError } = await supabase
        .from("vegetation_blocks")
        .insert(payload)
        .select("*")
        .single();

      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }

      if (imageFile && data?.id) {
        const photoUrl = await uploadItemImage(imageFile, "vegetation", data.id);
        const stage = currentCropStage(cropType, plantingDate || undefined);
        const notes = encodeTimelineNotes({
          note: "Field photo added when creating this block",
          cropStage: stage.id
        });

        const { error: photoError } = await supabase
          .from("vegetation_blocks")
          .update({
            photo_url: photoUrl,
            updated_at: new Date().toISOString()
          })
          .eq("id", data.id);

        if (photoError) throw photoError;

        const { error: timelineError } = await supabase.from("health_timeline_photos").insert({
          asset_type: "vegetation",
          asset_id: data.id,
          photo_url: photoUrl,
          notes,
          captured_at: new Date().toISOString()
        });

        if (timelineError) throw timelineError;
      }

      const created: VegetationBlock = {
        id: data.id,
        externalId: data.external_id,
        cropType: data.crop_type,
        variety: data.variety ?? undefined,
        plantingDate: data.planting_date,
        areaHectares: data.area_hectares ?? undefined,
        qrCode: data.qr_code ?? undefined,
        photoUrl: data.photo_url ?? undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      void created;
      await queryClient.invalidateQueries({ queryKey: ["vegetation-list"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      router.push("/vegetation");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save crop block. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormPage
      backHref="/vegetation"
      backLabel="Back to fields"
      eyebrow="Fields"
      title="Add crop block"
      description="Create a block for a field or paddock so you can track variety, planting date, soil logs, and inputs."
      image="/images/home/aerial.jpg"
    >
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="alert-error">
            {error}
          </div>
        )}

        <div>
          <p className="label-field">Field photo (optional)</p>
          <p className="mt-1 text-xs text-ink-subtle">
            Add a picture of the field now so it shows on the farm map and growth timeline. Max{" "}
            {formatMaxImageSize()}.
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (!file) {
                setImageFile(null);
                return;
              }
              try {
                assertImageWithinLimit(file);
                setError(null);
                setImageFile(file);
              } catch (err) {
                setImageFile(null);
                if (fileRef.current) fileRef.current.value = "";
                setError(err instanceof Error ? err.message : "Image is too large.");
              }
            }}
          />

          {previewUrl ? (
            <div className="relative mt-3 overflow-hidden rounded-card border border-stone bg-ivory">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected field"
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/80 to-transparent p-3 pt-10">
                <p className="truncate text-sm text-paper">{imageFile?.name}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="btn-secondary min-h-9 bg-paper/95 text-xs"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="inline-flex min-h-9 items-center gap-1 rounded-control border border-stone-strong bg-paper/95 px-3 text-xs font-medium text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-3 flex min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-stone-strong bg-ivory px-4 py-8 text-center transition hover:border-ink/25 hover:bg-paper"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink-subtle">
                <ImagePlus className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-ink">Add field photo</span>
              <span className="max-w-xs text-xs text-ink-muted">
                Take a photo or choose one from your library.
              </span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <Camera className="h-3.5 w-3.5" />
                Camera or gallery
              </span>
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="block-external-id">
              Block ID (optional)
            </label>
            <input
              id="block-external-id"
              type="text"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              placeholder="e.g. Field 1 - Maize North"
              className="input-field mt-1"
            />
            <p className="mt-1 text-xs text-ink-subtle">
              Use a name your team already recognises. This ID will appear on the QR tag.
            </p>
          </div>
          <div>
            <label className="label-field" htmlFor="block-crop-type">
              Crop type
            </label>
            <select
              id="block-crop-type"
              value={cropType}
              onChange={(e) => setCropType(e.target.value as CropType)}
              className="input-field mt-1"
            >
              {cropTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {cropType === "other" && (
              <>
                <label
                  className="mt-3 block text-xs font-medium text-ink-muted"
                  htmlFor="block-custom-crop-name"
                >
                  Custom crop name
                </label>
                <input
                  id="block-custom-crop-name"
                  type="text"
                  value={customCropName}
                  onChange={(e) => setCustomCropName(e.target.value)}
                  placeholder="e.g. onions, green beans"
                  className="input-field mt-1 text-sm"
                />
                <p className="mt-1 text-xs text-ink-subtle">
                  Pick a main crop type from the list, then give it your own name when needed.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label-field" htmlFor="block-variety">
              Variety (optional)
            </label>
            <input
              id="block-variety"
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="e.g. PAN 53, local variety"
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="block-planting-date">
              Planting date
            </label>
            <input
              id="block-planting-date"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="block-area">
              Area (optional)
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="block-area"
                type="number"
                min="0"
                step={areaUnit === "ha" ? "0.01" : "1"}
                value={areaValue}
                onChange={(e) => setAreaValue(e.target.value)}
                className="input-field"
              />
              <select
                aria-label="Area unit"
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as "ha" | "m2")}
                className="input-field"
              >
                <option value="ha">ha</option>
                <option value="m2">m²</option>
              </select>
            </div>
            <p className="mt-1 text-xs text-ink-subtle">
              Use hectares (ha) for larger fields or square metres (m²) for smaller plots. 1 ha =
              10,000 m².
            </p>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? (imageFile ? "Saving block & photo…" : "Saving block…") : "Save block"}
        </button>
      </form>
    </FormPage>
  );
}
