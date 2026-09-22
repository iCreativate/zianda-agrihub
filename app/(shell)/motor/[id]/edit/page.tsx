"use client";

import { FormPage } from "@/components/shell/form-page";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { MotorEntry } from "../../page";
import { uploadItemImage } from "@/lib/supabase/upload";

const STORAGE_KEY = "zianda_motor_vehicles";
const VEHICLE_TYPES = ["Tractor", "Bakkie / LDV", "Trailer", "Harvester / combine", "Other"];

function getEntry(id: string): MotorEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries: MotorEntry[] = raw ? JSON.parse(raw) : [];
    return entries.find((e) => e.id === id) ?? null;
  } catch {
    return null;
  }
}

export default function EditMotorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [type, setType] = useState(VEHICLE_TYPES[0]);
  const [makeModel, setMakeModel] = useState("");
  const [regOrSerial, setRegOrSerial] = useState("");
  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const e = getEntry(id);
    if (e) {
      setType(e.type);
      setMakeModel(e.makeModel);
      setRegOrSerial(e.regOrSerial);
      setNotes(e.notes);
    }
    setLoaded(true);
  }, [id]);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const entries: MotorEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const index = entries.findIndex((x) => x.id === id);
      if (index === -1) {
        router.push("/motor");
        return;
      }
      let imageUrl = entries[index].imageUrl;
      if (imageFile) imageUrl = await uploadItemImage(imageFile, "motor", id);
      entries[index] = {
        ...entries[index],
        type,
        makeModel: makeModel.trim() || "—",
        regOrSerial: regOrSerial.trim() || "—",
        notes: notes.trim(),
        imageUrl,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      router.push(`/motor/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) return <p className="text-sm text-ink-subtle">Loading…</p>;

  return (
    <FormPage
      backHref={`/motor/${id}`}
      backLabel="Back to vehicle"
      eyebrow="Yard"
      title="Edit vehicle"
      image="/images/home/machinery.jpg"
    >
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="alert-error">{error}</div>
        )}
        <div>
          <label className="label-field" htmlFor="type">Vehicle type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="input-field mt-1">
            {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="makeModel">Make & model</label>
          <input id="makeModel" type="text" value={makeModel} onChange={(e) => setMakeModel(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="label-field" htmlFor="regOrSerial">Registration or serial number</label>
          <input id="regOrSerial" type="text" value={regOrSerial} onChange={(e) => setRegOrSerial(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="label-field" htmlFor="notes">Notes (optional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field mt-1" />
        </div>
        <div>
          <label className="label-field">Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-stone file:px-3 file:py-1.5 file:text-ink-muted" />
          {imageFile && <p className="mt-1 text-xs text-ink-subtle">New: {imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Saving…" : "Save changes"}</button>
          <Link href={`/motor/${id}`} className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </FormPage>
  );
}
