"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, ArrowLeft } from "lucide-react";

const STORAGE_KEY = "zianda_motor_vehicles";

type MotorEntry = {
  id: string;
  type: string;
  makeModel: string;
  regOrSerial: string;
  notes: string;
  imageUrl?: string;
  addedAt: string;
};

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

export default function MotorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [entry, setEntry] = useState<MotorEntry | null | undefined>(undefined);

  useEffect(() => {
    setEntry(getEntry(id));
  }, [id]);

  if (entry === undefined) return <p className="text-sm text-ink-subtle">Loading…</p>;
  if (entry === null) {
    return (
      <>
        <Link href="/motor" className="link-quiet">← Back to motor</Link>
        <p className="text-ink-muted">Vehicle not found.</p>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/motor" className="inline-flex items-center gap-1 link-quiet">
          <ArrowLeft className="h-4 w-4" /> Back to motor (vehicles)
        </Link>
        <Link href={`/motor/${id}/edit`} className="btn-primary">
          <Pencil className="h-4 w-4" /> Edit
        </Link>
      </div>
      <div className="card-shell space-y-4">
        {entry.imageUrl && (
          <div className="overflow-hidden rounded-xl bg-ivory-deep">
            <img src={entry.imageUrl} alt="" className="max-h-80 w-full object-contain" />
          </div>
        )}
        <h1 className="text-xl font-semibold text-ink">{entry.type} – {entry.makeModel}</h1>
        <dl className="grid gap-3 text-sm">
          <div>
            <dt className="text-ink-subtle">Type</dt>
            <dd className="font-medium text-ink">{entry.type}</dd>
          </div>
          <div>
            <dt className="text-ink-subtle">Make & model</dt>
            <dd className="text-ink">{entry.makeModel}</dd>
          </div>
          <div>
            <dt className="text-ink-subtle">Registration / serial</dt>
            <dd className="text-ink">{entry.regOrSerial}</dd>
          </div>
          {entry.notes && (
            <div>
              <dt className="text-ink-subtle">Notes</dt>
              <dd className="text-ink-muted whitespace-pre-wrap">{entry.notes}</dd>
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
