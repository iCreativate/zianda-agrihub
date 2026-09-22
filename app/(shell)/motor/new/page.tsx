"use client";

import { FormPage } from "@/components/shell/form-page";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { MotorEntry } from "../page";
import { uploadItemImage } from "@/lib/supabase/upload";

const STORAGE_KEY = "zianda_motor_vehicles";
const VEHICLE_TYPES = ["Tractor", "Bakkie / LDV", "Trailer", "Harvester / combine", "Other"];

export default function NewMotorPage() {
  const router = useRouter();
  const [type, setType] = useState(VEHICLE_TYPES[0]);
  const [makeModel, setMakeModel] = useState("");
  const [regOrSerial, setRegOrSerial] = useState("");
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
      if (imageFile) imageUrl = await uploadItemImage(imageFile, "motor", id);
      const entries: MotorEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const newEntry: MotorEntry = {
        id,
        type,
        makeModel: makeModel.trim() || "—",
        regOrSerial: regOrSerial.trim() || "—",
        notes: notes.trim(),
        imageUrl,
        addedAt: new Date().toISOString(),
      };
      entries.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      router.push("/motor");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormPage
      backHref="/motor"
      backLabel="Back to motor"
      eyebrow="Yard"
      title="Add vehicle"
      description="Record a tractor, bakkie, trailer, or other agricultural vehicle."
      image="/images/home/machinery.jpg"
    >
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="alert-error">{error}</div>
        )}
        <div>
          <label className="label-field" htmlFor="type">
            Vehicle type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-field mt-1"
          >
            {VEHICLE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="makeModel">
            Make & model
          </label>
          <input
            id="makeModel"
            type="text"
            value={makeModel}
            onChange={(e) => setMakeModel(e.target.value)}
            placeholder="e.g. John Deere 5055, Toyota Hilux"
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="regOrSerial">
            Registration or serial number
          </label>
          <input
            id="regOrSerial"
            type="text"
            value={regOrSerial}
            onChange={(e) => setRegOrSerial(e.target.value)}
            placeholder="e.g. ABC 123 GP, or serial if no reg"
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Next service date, insurance, etc."
            rows={2}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field">Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-stone file:px-3 file:py-1.5 file:text-ink-muted" />
          {imageFile && <p className="mt-1 text-xs text-ink-subtle">{imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Add vehicle"}
          </button>
          <Link href="/motor" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </FormPage>
  );
}
