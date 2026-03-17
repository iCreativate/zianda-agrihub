"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, ArrowLeft } from "lucide-react";

const STORAGE_KEY = "zianda_plant_machinery";

type PlantMachineryEntry = {
  id: string;
  name: string;
  type: string;
  notes: string;
  imageUrl?: string;
  addedAt: string;
};

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

export default function PlantMachineryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [entry, setEntry] = useState<PlantMachineryEntry | null | undefined>(undefined);

  useEffect(() => {
    setEntry(getEntry(id));
  }, [id]);

  if (entry === undefined) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    );
  }

  if (entry === null) {
    return (
      <div className="space-y-6">
        <Link href="/plant-machinery" className="text-sm font-medium text-slate-300 hover:text-white">
          ← Back to plant and machinery
        </Link>
        <p className="text-slate-300">Equipment not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/plant-machinery" className="inline-flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to plant and machinery
        </Link>
        <Link href={`/plant-machinery/${id}/edit`} className="btn-primary">
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>
      <div className="card-shell space-y-4">
        {entry.imageUrl && (
          <div className="overflow-hidden rounded-xl bg-slate-800">
            <img src={entry.imageUrl} alt="" className="max-h-80 w-full object-contain" />
          </div>
        )}
        <h1 className="text-xl font-semibold text-slate-50">{entry.name}</h1>
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-slate-400">Type</dt>
            <dd className="font-medium text-slate-100">{entry.type}</dd>
          </div>
          {entry.notes && (
            <div>
              <dt className="text-slate-400">Notes</dt>
              <dd className="text-slate-200 whitespace-pre-wrap">{entry.notes}</dd>
            </div>
          )}
          <div>
            <dt className="text-slate-400">Added</dt>
            <dd className="text-slate-300">
              {new Date(entry.addedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
