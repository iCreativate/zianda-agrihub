"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ToolEntry } from "../../page";
import { uploadItemImage } from "@/lib/supabase/upload";

const STORAGE_KEY = "zianda_tools";
const CATEGORIES = ["Hand tools", "Power tools", "Implements", "Measuring & fencing", "Other"];

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

export default function EditToolPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const e = getEntry(id);
    if (e) {
      setName(e.name);
      setCategory(e.category);
      setCondition(e.condition);
      setLocation(e.location);
    }
    setLoaded(true);
  }, [id]);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const entries: ToolEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const index = entries.findIndex((x) => x.id === id);
      if (index === -1) {
        router.push("/tools");
        return;
      }
      let imageUrl = entries[index].imageUrl;
      if (imageFile) imageUrl = await uploadItemImage(imageFile, "tools", id);
      entries[index] = {
        ...entries[index],
        name: name.trim() || "Unnamed tool",
        category,
        condition: condition.trim(),
        location: location.trim(),
        imageUrl,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      router.push(`/tools/${id}`);
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
      <Link href={`/tools/${id}`} className="text-sm font-medium text-slate-300 hover:text-white">← Back to tool</Link>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">Edit tool</h1>
        <p className="text-sm text-slate-300">Update the details below.</p>
      </div>
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="name">Tool name or description</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="input-dark mt-1">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="condition">Condition (optional)</label>
          <input id="condition" type="text" value={condition} onChange={(e) => setCondition(e.target.value)} className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="location">Storage location (optional)</label>
          <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-slate-200" />
          {imageFile && <p className="mt-1 text-xs text-slate-500">New: {imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Saving…" : "Save changes"}</button>
          <Link href={`/tools/${id}`} className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
