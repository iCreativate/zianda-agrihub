"use client";

import { FormPage } from "@/components/shell/form-page";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useMarketplaceListing } from "@/lib/supabase/hooks";
import { uploadItemImage } from "@/lib/supabase/upload";
import { SyncError } from "@/components/ui/sync-error";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketplaceCategory, MarketplaceCondition, MarketplaceSellerType } from "@/types/agriculture";

const CATEGORIES: MarketplaceCategory[] = [
  "livestock", "crops", "produce", "equipment", "seeds", "feed", "other"
];

export default function EditMarketplacePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const { data: entry, isLoading } = useMarketplaceListing(id);
  const [type, setType] = useState<"selling" | "buying">("selling");
  const [category, setCategory] = useState<MarketplaceCategory>("other");
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState<MarketplaceCondition>("good");
  const [sellerType, setSellerType] = useState<MarketplaceSellerType>("farmer");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (entry) {
      setType(entry.type);
      setCategory(entry.category ?? "other");
      setTitle(entry.title);
      setQuantity(entry.quantity ?? "");
      setDescription(entry.description ?? "");
      setContact(entry.contact ?? "");
      setCreatorName(entry.creatorName ?? "");
      setPrice(entry.priceAmount !== undefined ? String(entry.priceAmount) : "");
      setLocation(entry.location ?? "");
      setCondition(entry.condition ?? "good");
      setSellerType(entry.sellerType ?? "farmer");
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
        category,
        quantity: quantity.trim() || null,
        location: location.trim() || null,
        condition,
        seller_type: sellerType,
        price_amount: price ? Number(price) : null,
        price_currency: "ZAR"
      };
      if (imageFile) {
        payload.image_url = await uploadItemImage(imageFile, "marketplace", id);
      }
      const { error: updateError } = await supabase
        .from("marketplace_listings")
        .update(payload)
        .eq("id", id);

      if (updateError) throw updateError;
      queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace-listing", id] });
      router.push(`/marketplace/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something didn't sync.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading || !entry) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-card" />
      </div>
    );
  }

  return (
    <FormPage
      backHref={`/marketplace/${id}`}
      backLabel="Back to listing"
      eyebrow="Trade"
      title="Edit listing"
      description="Update photos, pricing, and seller details."
      image="/images/home/grain.jpg"
      contentClassName="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 rounded-card border border-stone/90 bg-paper/95 p-5 backdrop-blur-sm md:p-6">
        {error && <SyncError onRetry={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as "selling" | "buying")} className="input-field mt-1">
              <option value="selling">For sale</option>
              <option value="buying">Wanted</option>
            </select>
          </div>
          <div>
            <label className="label-field">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as MarketplaceCategory)} className="input-field mt-1">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="title">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field mt-1" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="quantity">Quantity</label>
            <input id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input-field mt-1" />
          </div>
          <div>
            <label className="label-field" htmlFor="price">Price (ZAR)</label>
            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field mt-1" />
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input-field mt-1" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="location">Location</label>
            <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="input-field mt-1" />
          </div>
          <div>
            <label className="label-field" htmlFor="condition">Condition</label>
            <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value as MarketplaceCondition)} className="input-field mt-1">
              {(["new", "excellent", "good", "used", "fair"] as const).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="creatorName">Seller name</label>
            <input id="creatorName" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} className="input-field mt-1" />
          </div>
          <div>
            <label className="label-field">Seller type</label>
            <select value={sellerType} onChange={(e) => setSellerType(e.target.value as MarketplaceSellerType)} className="input-field mt-1">
              <option value="farmer">Farmer</option>
              <option value="organisation">Organisation</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="contact">Contact</label>
          <input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="label-field">Replace image</label>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm file:mr-3 file:rounded-control file:border-0 file:bg-stone file:px-3 file:py-2" />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary min-h-11" disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </button>
          <Link href={`/marketplace/${id}`} className="btn-secondary min-h-11">Cancel</Link>
        </div>
      </form>
    </FormPage>
  );
}
