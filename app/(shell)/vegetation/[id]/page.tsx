"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useVegetationList } from "@/lib/supabase/hooks";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
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

interface VegetationDetailPageProps {
  params: { id: string };
}

function formatArea(ha: number | undefined | null): string {
  if (ha == null || ha <= 0) return "—";
  if (ha < 0.0001) return `${Math.round(ha * 10000)} m²`;
  return `${ha} ha`;
}

export default function VegetationDetailPage({ params }: VegetationDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useVegetationList();
  const block = (data ?? []).find((b) => b.id === params.id);

  const [externalId, setExternalId] = useState(block?.externalId ?? "");
  const [cropType, setCropType] = useState<CropType>(block?.cropType ?? "maize");
  const [customCropName, setCustomCropName] = useState(
    block?.cropType === "other" && block.variety ? block.variety : ""
  );
  const [variety, setVariety] = useState(block?.variety ?? "");
  const [plantingDate, setPlantingDate] = useState(block?.plantingDate ?? "");
  const [areaHectares, setAreaHectares] = useState(
    block?.areaHectares != null ? String(block.areaHectares) : ""
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!block) {
    return (
      <div className="space-y-4">
        <Link
          href="/vegetation"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          ← Back to crops
        </Link>
        <p className="text-sm text-slate-300">Crop block not found.</p>
      </div>
    );
  }

  // Help TypeScript (and build) understand block is defined below.
  const b = block;

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
            (cropType === "other" && customCropName.trim()
              ? customCropName.trim()
              : null),
          planting_date: plantingDate || null,
          area_hectares: areaHectares ? Number(areaHectares) : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", b.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["vegetation-list"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update block. Please try again."
      );
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
      const { error: deleteError } = await supabase
        .from("vegetation_blocks")
        .delete()
        .eq("id", b.id);

      if (deleteError) {
        setError(deleteError.message);
        setDeleting(false);
        return;
      }
      router.push("/vegetation");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete block. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/vegetation"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          ← Back to crops
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="btn-danger disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete block"}
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          {block.externalId}
        </h1>
        <p className="text-sm text-slate-300">
          {block.cropType === "other" && block.variety ? block.variety : block.cropType}
          {block.cropType === "other" && block.variety
            ? " • Other"
            : block.variety
            ? ` • ${block.variety}`
            : ""}
          {block.plantingDate ? ` • Planted: ${block.plantingDate}` : ""}
          {block.areaHectares != null && block.areaHectares > 0 && (
            <> • Area: {formatArea(block.areaHectares)}</>
          )}
        </p>
      </div>

      <form onSubmit={handleSave} className="card-shell space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="edit-external-id">
              Block ID
            </label>
            <input
              id="edit-external-id"
              type="text"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              className="input-dark mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="edit-crop-type">
              Crop type
            </label>
            <select
              id="edit-crop-type"
              value={cropType}
              onChange={(e) => setCropType(e.target.value as CropType)}
              className="input-dark mt-1"
            >
              {cropTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            {cropType === "other" && (
              <>
                <label
                  className="mt-3 block text-xs font-medium text-slate-200"
                  htmlFor="edit-custom-crop-name"
                >
                  Custom crop name
                </label>
                <input
                  id="edit-custom-crop-name"
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
            <label className="block text-sm font-medium text-slate-200" htmlFor="edit-variety">
              Variety
            </label>
            <input
              id="edit-variety"
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="input-dark mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="edit-planting-date">
              Planting date
            </label>
            <input
              id="edit-planting-date"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className="input-dark mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="edit-area">
              Area (ha)
            </label>
            <input
              id="edit-area"
              type="number"
              min="0"
              step="0.0001"
              value={areaHectares}
              onChange={(e) => setAreaHectares(e.target.value)}
              className="input-dark mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">
              Stored in hectares. 10,000 m² = 1 ha.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          QR ID: {block.qrCode || block.externalId}
        </p>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
