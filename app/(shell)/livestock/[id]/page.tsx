"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useLivestockList } from "@/lib/supabase/hooks";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { LivestockKnowledgePanel } from "@/components/ui/LivestockKnowledgePanel";

interface LivestockDetailPageProps {
  params: { id: string };
}

export default function LivestockDetailPage({ params }: LivestockDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useLivestockList();
  const animal = (data ?? []).find((a) => a.id === params.id);

  const [name, setName] = useState(animal?.name ?? "");
  const [breed, setBreed] = useState(animal?.breed ?? "");
  const [weightKg, setWeightKg] = useState(
    animal?.weightKg !== undefined ? String(animal.weightKg) : ""
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!animal) {
    return (
      <div className="space-y-4">
        <Link
          href="/livestock"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          ← Back to livestock
        </Link>
        <p className="text-sm text-slate-300">Animal not found.</p>
      </div>
    );
  }

  // Help TypeScript (and build) understand animal is defined below.
  const a = animal;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase
        .from("livestock")
        .update({
          name: name.trim() || a.externalId,
          breed: breed.trim() || null,
          weight_kg: weightKg ? Number(weightKg) : null
        })
        .eq("id", a.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update animal. Please try again."
      );
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
      const { error: deleteError } = await supabase
        .from("livestock")
        .delete()
        .eq("id", a.id);

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
      setError(
        err instanceof Error ? err.message : "Could not delete animal. Please try again."
      );
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/livestock"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          ← Back to livestock
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="btn-danger disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete animal"}
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          {animal.name || animal.externalId}
        </h1>
        <p className="text-sm text-slate-300">
          {animal.species}
          {animal.breed ? ` • ${animal.breed}` : ""}
          {animal.externalId ? ` • ID: ${animal.externalId}` : ""}
        </p>
      </div>

      <LivestockKnowledgePanel species={animal.species} breed={animal.breed} />

      <form onSubmit={handleSave} className="card-shell space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="edit-name">
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-dark mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="edit-breed">
              Breed
            </label>
            <input
              id="edit-breed"
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="input-dark mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="edit-weight">
              Current weight (kg)
            </label>
            <input
              id="edit-weight"
              type="number"
              min="0"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="input-dark mt-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div>
            {animal.dateOfBirth && <p>DOB: {animal.dateOfBirth}</p>}
            <p>QR ID: {animal.qrCode || animal.externalId}</p>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving changes…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

