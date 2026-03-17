"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SeedEntry } from "../page";
import { uploadItemImage } from "@/lib/supabase/upload";

const STORAGE_KEY = "zianda_seeds";

export default function NewSeedPage() {
  const router = useRouter();
  const [variety, setVariety] = useState("");
  const [supplier, setSupplier] = useState("");
  const [batch, setBatch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
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
      if (imageFile) imageUrl = await uploadItemImage(imageFile, "seeds", id);
      const entries: SeedEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const newEntry: SeedEntry = {
        id,
        variety: variety.trim() || "Unnamed variety",
        supplier: supplier.trim(),
        batch: batch.trim(),
        quantity: quantity.trim(),
        storageLocation: storageLocation.trim(),
        imageUrl,
        addedAt: new Date().toISOString(),
      };
      entries.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      router.push("/seeds");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/seeds" className="text-sm font-medium text-slate-300 hover:text-white">
        ← Back to seeds
      </Link>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Add seed record
        </h1>
        <p className="text-sm text-slate-300">
          Record a seed variety so you can track batches and link to crop blocks.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="variety">
            Variety name
          </label>
          <input
            id="variety"
            type="text"
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            placeholder="e.g. PAN 3P-565, DKC 80-10"
            className="input-dark mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="supplier">
            Supplier
          </label>
          <input
            id="supplier"
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="e.g. Pannar, Pioneer"
            className="input-dark mt-1"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="batch">
              Batch / lot number
            </label>
            <input
              id="batch"
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="e.g. L2024-001"
              className="input-dark mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="quantity">
              Quantity
            </label>
            <input
              id="quantity"
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 50 kg, 2 bags"
              className="input-dark mt-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="storageLocation">
            Storage location (optional)
          </label>
          <input
            id="storageLocation"
            type="text"
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value)}
            placeholder="e.g. Seed store, cool room"
            className="input-dark mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-slate-200" />
          {imageFile && <p className="mt-1 text-xs text-slate-500">{imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Add seed record"}
          </button>
          <Link href="/seeds" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
