"use client";

import { FormPage } from "@/components/shell/form-page";
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
    <FormPage
      backHref="/seeds"
      backLabel="Back to seeds"
      eyebrow="Inputs"
      title="Add seed record"
      description="Track seed varieties, suppliers, germination, and planting records."
      image="/images/home/vegetables.jpg"
    >
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="alert-error">{error}</div>
        )}
        <div>
          <label className="label-field" htmlFor="variety">
            Variety name
          </label>
          <input
            id="variety"
            type="text"
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            placeholder="e.g. PAN 3P-565, DKC 80-10"
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="supplier">
            Supplier
          </label>
          <input
            id="supplier"
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="e.g. Pannar, Pioneer"
            className="input-field mt-1"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="batch">
              Batch / lot number
            </label>
            <input
              id="batch"
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="e.g. L2024-001"
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="quantity">
              Quantity
            </label>
            <input
              id="quantity"
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 50 kg, 2 bags"
              className="input-field mt-1"
            />
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="storageLocation">
            Storage location (optional)
          </label>
          <input
            id="storageLocation"
            type="text"
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value)}
            placeholder="e.g. Seed store, cool room"
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
            {submitting ? "Saving…" : "Add seed record"}
          </button>
          <Link href="/seeds" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </FormPage>
  );
}
