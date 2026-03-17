"use client";

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

  if (!loaded) return <p className="text-sm text-slate-400">Loading…</p>;

  return (
    <div className="space-y-6">
      <Link href={`/motor/${id}`} className="text-sm font-medium text-slate-300 hover:text-white">← Back to vehicle</Link>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">Edit vehicle</h1>
        <p className="text-sm text-slate-300">Update the details below.</p>
      </div>
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="type">Vehicle type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="input-dark mt-1">
            {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="makeModel">Make & model</label>
          <input id="makeModel" type="text" value={makeModel} onChange={(e) => setMakeModel(e.target.value)} className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="regOrSerial">Registration or serial number</label>
          <input id="regOrSerial" type="text" value={regOrSerial} onChange={(e) => setRegOrSerial(e.target.value)} className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="notes">Notes (optional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-slate-200" />
          {imageFile && <p className="mt-1 text-xs text-slate-500">New: {imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Saving…" : "Save changes"}</button>
          <Link href={`/motor/${id}`} className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
