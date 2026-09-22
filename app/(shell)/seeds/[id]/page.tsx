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

  if (entry === undefined) return <p className="text-sm text-ink-subtle">Loading…</p>;
  if (entry === null) {
    return (
      <>
        <Link href="/seeds" className="link-quiet">← Back to seeds</Link>
        <p className="text-ink-muted">Seed record not found.</p>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/seeds" className="inline-flex items-center gap-1 link-quiet">
          <ArrowLeft className="h-4 w-4" /> Back to seeds
        </Link>
        <Link href={`/seeds/${id}/edit`} className="btn-primary">
          <Pencil className="h-4 w-4" /> Edit
        </Link>
      </div>
      <div className="card-shell space-y-4">
        {entry.imageUrl && (
          <div className="overflow-hidden rounded-xl bg-ivory-deep">
            <img src={entry.imageUrl} alt="" className="max-h-80 w-full object-contain" />
          </div>
        )}
        <h1 className="text-xl font-semibold text-ink">{entry.variety}</h1>
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-ink-subtle">Variety</dt>
            <dd className="font-medium text-ink">{entry.variety}</dd>
          </div>
          <div>
            <dt className="text-ink-subtle">Supplier</dt>
            <dd className="text-ink">{entry.supplier || "—"}</dd>
          </div>
          {entry.batch && (
            <div>
              <dt className="text-ink-subtle">Batch / lot</dt>
              <dd className="text-ink">{entry.batch}</dd>
            </div>
          )}
          <div>
            <dt className="text-ink-subtle">Quantity</dt>
            <dd className="text-ink">{entry.quantity || "—"}</dd>
          </div>
          {entry.storageLocation && (
            <div>
              <dt className="text-ink-subtle">Storage location</dt>
              <dd className="text-ink">{entry.storageLocation}</dd>
            </div>
          )}
          <div>
            <dt className="text-ink-subtle">Added</dt>
            <dd className="text-ink-muted">{new Date(entry.addedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
