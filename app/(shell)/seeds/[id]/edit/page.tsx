"use client";

import { FormPage } from "@/components/shell/form-page";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SeedEntry } from "../../page";
import { uploadItemImage } from "@/lib/supabase/upload";

const STORAGE_KEY = "zianda_seeds";

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

export default function EditSeedPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [variety, setVariety] = useState("");
  const [supplier, setSupplier] = useState("");
  const [batch, setBatch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const e = getEntry(id);
    if (e) {
      setVariety(e.variety);
      setSupplier(e.supplier);
      setBatch(e.batch);
      setQuantity(e.quantity);
      setStorageLocation(e.storageLocation);
    }
    setLoaded(true);
  }, [id]);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const entries: SeedEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const index = entries.findIndex((x) => x.id === id);
      if (index === -1) {
        router.push("/seeds");
        return;
      }
      let imageUrl = entries[index].imageUrl;
      if (imageFile) imageUrl = await uploadItemImage(imageFile, "seeds", id);
      entries[index] = {
        ...entries[index],
        variety: variety.trim() || "Unnamed variety",
        supplier: supplier.trim(),
        batch: batch.trim(),
        quantity: quantity.trim(),
        storageLocation: storageLocation.trim(),
        imageUrl,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      router.push(`/seeds/${id}`);
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
      backHref={`/seeds/${id}`}
      backLabel="Back to seed record"
      eyebrow="Inputs"
      title="Edit seed record"
      
      image="/images/home/vegetables.jpg"
    >
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="alert-error">{error}</div>
        )}
        <div>
          <label className="label-field" htmlFor="variety">Variety name</label>
          <input id="variety" type="text" value={variety} onChange={(e) => setVariety(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="label-field" htmlFor="supplier">Supplier</label>
          <input id="supplier" type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} className="input-field mt-1" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="batch">Batch / lot number</label>
            <input id="batch" type="text" value={batch} onChange={(e) => setBatch(e.target.value)} className="input-field mt-1" />
          </div>
          <div>
            <label className="label-field" htmlFor="quantity">Quantity</label>
            <input id="quantity" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input-field mt-1" />
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="storageLocation">Storage location (optional)</label>
          <input id="storageLocation" type="text" value={storageLocation} onChange={(e) => setStorageLocation(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="label-field">Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-stone file:px-3 file:py-1.5 file:text-ink-muted" />
          {imageFile && <p className="mt-1 text-xs text-ink-subtle">New: {imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Saving…" : "Save changes"}</button>
          <Link href={`/seeds/${id}`} className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </FormPage>
  );
}
