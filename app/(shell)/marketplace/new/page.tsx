"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { uploadItemImage } from "@/lib/supabase/upload";

const MY_LISTING_IDS_KEY = "zianda_marketplace_my_listing_ids";

function addMyListingId(id: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(MY_LISTING_IDS_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    if (ids.includes(id)) return;
    ids.unshift(id);
    localStorage.setItem(MY_LISTING_IDS_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export default function NewMarketplacePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [type, setType] = useState<"selling" | "buying">("selling");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const { data, error: insertError } = await supabase
        .from("marketplace_listings")
        .insert({
          type,
          title: title.trim() || "Untitled listing",
          description: description.trim() || null,
          contact: contact.trim() || null,
          creator_name: creatorName.trim() || null,
        })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }
      const listingId = data?.id;
      if (listingId && imageFile) {
        const imageUrl = await uploadItemImage(imageFile, "marketplace", listingId);
        await supabase.from("marketplace_listings").update({ image_url: imageUrl }).eq("id", listingId);
      }
      if (listingId) addMyListingId(listingId);
      queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
      router.push("/marketplace");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/marketplace" className="text-sm font-medium text-slate-300 hover:text-white">
        ← Back to marketplace
      </Link>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Add listing
        </h1>
        <p className="text-sm text-slate-300">
          List something you're selling or looking to buy. Other farmers will see it in the marketplace.
        </p>
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
          <label className="block text-sm font-medium text-slate-200" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === "selling" ? "e.g. Maize for sale, Grade A" : "e.g. Looking for second-hand planter"}
            className="input-dark mt-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="creatorName">
            Your name or farm name (optional)
          </label>
          <input
            id="creatorName"
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="So other farmers know who listed this"
            className="input-dark mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="description">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Quantity, quality, location, price or budget…"
            rows={3}
            className="input-dark mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200" htmlFor="contact">
            Contact
          </label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Phone number or how to reach you"
            className="input-dark mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">Image (optional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-slate-200"
          />
          {imageFile && (
            <p className="mt-1 text-xs text-slate-500">{imageFile.name}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Adding…" : "Add listing"}
          </button>
          <Link href="/marketplace" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
