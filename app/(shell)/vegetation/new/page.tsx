"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
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
  const [externalId, setExternalId] = useState("");
  const [cropType, setCropType] = useState<CropType>("maize");
  const [customCropName, setCustomCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [areaValue, setAreaValue] = useState<string>("");
  const [areaUnit, setAreaUnit] = useState<"ha" | "m2">("ha");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // If farmer selects "other" and types a custom name, default variety to that name
      variety:
        variety.trim() ||
        (cropType === "other" && customCropName.trim()
          ? customCropName.trim()
          : null),
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

      const created: VegetationBlock = {
        id: data.id,
        externalId: data.external_id,
        cropType: data.crop_type,
        variety: data.variety ?? undefined,
        plantingDate: data.planting_date,
        areaHectares: data.area_hectares ?? undefined,
        qrCode: data.qr_code ?? undefined,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Add crop block
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Create a block for a field or paddock so you can track variety, planting date, soil
            logs, and inputs.
          </p>
        </div>
        <Link
          href="/vegetation"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          Cancel
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card-shell space-y-5"
      >
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="block-external-id"
            >
              Block ID (optional)
            </label>
            <input
              id="block-external-id"
              type="text"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              placeholder="e.g. Field 1 - Maize North"
              className="input-dark mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">
              Use a name your team already recognises. This ID will appear on the QR tag.
            </p>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="block-crop-type"
            >
              Crop type
            </label>
            <select
              id="block-crop-type"
              value={cropType}
              onChange={(e) => setCropType(e.target.value as CropType)}
              className="input-dark mt-1"
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
                  className="mt-3 block text-xs font-medium text-slate-200"
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
                  className="input-dark mt-1 text-sm"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Pick a main crop type from the list, then give it your own name when needed.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="block-variety">
              Variety (optional)
            </label>
            <input
              id="block-variety"
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="e.g. PAN 53, local variety"
              className="input-dark mt-1"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="block-planting-date"
            >
              Planting date
            </label>
            <input
              id="block-planting-date"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="input-dark mt-1"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="block-area"
            >
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
                className="input-dark"
              />
              <select
                aria-label="Area unit"
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as "ha" | "m2")}
                className="input-dark"
              >
                <option value="ha">ha</option>
                <option value="m2">m²</option>
              </select>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Use hectares (ha) for larger fields or square metres (m²) for smaller plots. 1 ha = 10,000 m².
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:opacity-60"
        >
          {submitting ? "Saving block…" : "Save block"}
        </button>
      </form>
    </div>
  );
}

