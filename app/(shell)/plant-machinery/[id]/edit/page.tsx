"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PlantMachineryEntry } from "../../page";
import { uploadItemImage } from "@/lib/supabase/upload";

const STORAGE_KEY = "zianda_plant_machinery";
const EQUIPMENT_TYPES = ["Tractor", "Harvester", "Irrigation system", "Generator", "Pump", "Silo / storage", "Other"];

function getEntry(id: string): PlantMachineryEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries: PlantMachineryEntry[] = raw ? JSON.parse(raw) : [];
    return entries.find((e) => e.id === id) ?? null;
  } catch {
    return null;
  }
}

export default function EditPlantMachineryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [name, setName] = useState("");
  const [type, setType] = useState(EQUIPMENT_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const e = getEntry(id);
    if (e) {
      setName(e.name);
      setType(e.type);
      setNotes(e.notes);
    }
    setLoaded(true);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const entries: PlantMachineryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const index = entries.findIndex((x) => x.id === id);
      if (index === -1) {
        router.push("/plant-machinery");
        return;
      }
      let imageUrl = entries[index].imageUrl;
      if (imageFile) {
        imageUrl = await uploadItemImage(imageFile, "plant-machinery", id);
      }
      entries[index] = {
        ...entries[index],
        name: name.trim() || "Unnamed equipment",
        type,
        notes: notes.trim(),
        imageUrl,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      router.push(`/plant-machinery/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) {
    return <p className="text-sm text-slate-400">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <Link href={`/plant-machinery/${id}`} className="text-sm font-medium text-slate-300 hover:text-white">
        ← Back to equipment
      </Link>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Edit equipment
        </h1>
        <p className="text-sm text-slate-300">
          Update the details below.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="name">
            Name or description
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-dark mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-dark mt-1"
          >
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="input-dark mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-slate-200"
          />
          {imageFile && <p className="mt-1 text-xs text-slate-500">New: {imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </button>
          <Link href={`/plant-machinery/${id}`} className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
