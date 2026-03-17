"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, ArrowLeft } from "lucide-react";

const STORAGE_KEY = "zianda_tools";

type ToolEntry = {
  id: string;
  name: string;
  category: string;
  condition: string;
  location: string;
  imageUrl?: string;
  addedAt: string;
};

function getEntry(id: string): ToolEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries: ToolEntry[] = raw ? JSON.parse(raw) : [];
    return entries.find((e) => e.id === id) ?? null;
  } catch {
    return null;
  }
}

export default function ToolDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [entry, setEntry] = useState<ToolEntry | null | undefined>(undefined);

  useEffect(() => {
    setEntry(getEntry(id));
  }, [id]);

  if (entry === undefined) return <p className="text-sm text-slate-400">Loading…</p>;
  if (entry === null) {
    return (
      <>
        <Link href="/tools" className="text-sm font-medium text-slate-300 hover:text-white">← Back to tools</Link>
        <p className="text-slate-300">Tool not found.</p>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/tools" className="inline-flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to tools
        </Link>
        <Link href={`/tools/${id}/edit`} className="btn-primary">
          <Pencil className="h-4 w-4" /> Edit
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
            <dt className="text-slate-400">Category</dt>
            <dd className="font-medium text-slate-100">{entry.category}</dd>
          </div>
          {entry.condition && (
            <div>
              <dt className="text-slate-400">Condition</dt>
              <dd className="text-slate-100">{entry.condition}</dd>
            </div>
          )}
          {entry.location && (
            <div>
              <dt className="text-slate-400">Storage location</dt>
              <dd className="text-slate-100">{entry.location}</dd>
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
