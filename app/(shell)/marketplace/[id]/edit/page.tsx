"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useMarketplaceListing } from "@/lib/supabase/hooks";
import { uploadItemImage } from "@/lib/supabase/upload";

export default function EditMarketplacePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const { data: entry, isLoading } = useMarketplaceListing(id);
  const [type, setType] = useState<"selling" | "buying">("selling");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (entry) {
      setType(entry.type);
      setTitle(entry.title);
      setDescription(entry.description ?? "");
      setContact(entry.contact ?? "");
      setCreatorName(entry.creatorName ?? "");
    }
  }, [entry]);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const payload: Record<string, unknown> = {
        type,
        title: title.trim() || "Untitled listing",
        description: description.trim() || null,
        contact: contact.trim() || null,
        creator_name: creatorName.trim() || null,
      };
      if (imageFile) {
        payload.image_url = await uploadItemImage(imageFile, "marketplace", id);
      }
      const { error: updateError } = await supabase
        .from("marketplace_listings")
        .update(payload)
        .eq("id", id);

      if (updateError) {
        setError(updateError.message);
        setSubmitting(false);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-listing", id] });
      router.push(`/marketplace/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading || !entry) {
    return <p className="text-sm text-slate-400">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <Link href={`/marketplace/${id}`} className="text-sm font-medium text-slate-300 hover:text-white">
        ← Back to listing
      </Link>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">Edit listing</h1>
        <p className="text-sm text-slate-300">Update the details below.</p>
      </div>
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-200">Listing type</label>
          <div className="mt-2 flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="type"
                value="selling"
                checked={type === "selling"}
                onChange={() => setType("selling")}
                className="h-4 w-4 border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-400"
              />
              <span className="text-sm text-slate-200">Selling</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="type"
                value="buying"
                checked={type === "buying"}
                onChange={() => setType("buying")}
                className="h-4 w-4 border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-400"
              />
              <span className="text-sm text-slate-200">Buying</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="title">Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="creatorName">Your name or farm name (optional)</label>
          <input id="creatorName" type="text" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="description">Description (optional)</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="contact">Contact</label>
          <input id="contact" type="text" value={contact} onChange={(e) => setContact(e.target.value)} className="input-dark mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">Image (optional)</label>
          {entry.imageUrl && (
            <p className="mt-1 text-xs text-slate-500">Current image: <a href={entry.imageUrl} target="_blank" rel="noreferrer" className="text-emerald-400 underline">View</a></p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-slate-200"
          />
          {imageFile && <p className="mt-1 text-xs text-slate-500">New: {imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Saving…" : "Save changes"}</button>
          <Link href={`/marketplace/${id}`} className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
