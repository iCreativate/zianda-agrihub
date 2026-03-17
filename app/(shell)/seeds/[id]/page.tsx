"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, ArrowLeft } from "lucide-react";

const STORAGE_KEY = "zianda_seeds";

type SeedEntry = {
  id: string;
  variety: string;
  supplier: string;
  batch: string;
  quantity: string;
  storageLocation: string;
  imageUrl?: string;
  addedAt: string;
};

function getEntry(id: string): SeedEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries: SeedEntry[] = raw ? JSON.parse(raw) : [];
    return entries.find((e) => e.id === id) ?? null;
  } catch {
    return null;
  }
}

export default function SeedDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [entry, setEntry] = useState<SeedEntry | null | undefined>(undefined);

  useEffect(() => {
    setEntry(getEntry(id));
  }, [id]);

  if (entry === undefined) return <p className="text-sm text-slate-400">Loading…</p>;
  if (entry === null) {
    return (
      <>
        <Link href="/seeds" className="text-sm font-medium text-slate-300 hover:text-white">← Back to seeds</Link>
        <p className="text-slate-300">Seed record not found.</p>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/seeds" className="inline-flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to seeds
        </Link>
        <Link href={`/seeds/${id}/edit`} className="btn-primary">
          <Pencil className="h-4 w-4" /> Edit
        </Link>
      </div>
      <div className="card-shell space-y-4">
        {entry.imageUrl && (
          <div className="overflow-hidden rounded-xl bg-slate-800">
            <img src={entry.imageUrl} alt="" className="max-h-80 w-full object-contain" />
          </div>
        )}
        <h1 className="text-xl font-semibold text-slate-50">{entry.variety}</h1>
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-slate-400">Variety</dt>
            <dd className="font-medium text-slate-100">{entry.variety}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Supplier</dt>
            <dd className="text-slate-100">{entry.supplier || "—"}</dd>
          </div>
          {entry.batch && (
            <div>
              <dt className="text-slate-400">Batch / lot</dt>
              <dd className="text-slate-100">{entry.batch}</dd>
            </div>
          )}
          <div>
            <dt className="text-slate-400">Quantity</dt>
            <dd className="text-slate-100">{entry.quantity || "—"}</dd>
          </div>
          {entry.storageLocation && (
            <div>
              <dt className="text-slate-400">Storage location</dt>
              <dd className="text-slate-100">{entry.storageLocation}</dd>
            </div>
          )}
          <div>
            <dt className="text-slate-400">Added</dt>
            <dd className="text-slate-300">{new Date(entry.addedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
