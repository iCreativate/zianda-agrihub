"use client";

import { FormPage } from "@/components/shell/form-page";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PlantMachineryEntry } from "../page";
import { uploadItemImage } from "@/lib/supabase/upload";

const STORAGE_KEY = "zianda_plant_machinery";
const EQUIPMENT_TYPES = ["Tractor", "Harvester", "Irrigation system", "Generator", "Pump", "Silo / storage", "Other"];

export default function NewPlantMachineryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState(EQUIPMENT_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const id = crypto.randomUUID();
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadItemImage(imageFile, "plant-machinery", id);
      }
      const entries: PlantMachineryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const newEntry: PlantMachineryEntry = {
        id,
        name: name.trim() || "Unnamed equipment",
        type,
        notes: notes.trim(),
        imageUrl,
        addedAt: new Date().toISOString(),
      };
      entries.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      router.push("/plant-machinery");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormPage
      backHref="/plant-machinery"
      backLabel="Back to plant and machinery"
      eyebrow="Yard"
      title="Add equipment"
      description="Record tractors, harvesters, irrigation systems, and other farm equipment."
      image="/images/home/machinery.jpg"
    >
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="alert-error">
            {error}
          </div>
        )}
        <div>
          <label className="label-field" htmlFor="name">
            Name or description
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Main tractor, Centre pivot A"
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-field mt-1"
          >
            {EQUIPMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Make, model, year, next service date…"
            rows={3}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-stone file:px-3 file:py-1.5 file:text-ink-muted"
          />
          {imageFile && <p className="mt-1 text-xs text-ink-subtle">{imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Add equipment"}
          </button>
          <Link href="/plant-machinery" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </FormPage>
  );
}
