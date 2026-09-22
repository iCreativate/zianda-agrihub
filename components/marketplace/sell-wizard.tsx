"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Camera, Check } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { uploadItemImage } from "@/lib/supabase/upload";
import { useFarm } from "@/lib/farm/use-farm";
import { MARKETPLACE_CATEGORIES, listingImage } from "@/lib/marketplace/constants";
import { marketplaceInsertPayload } from "@/lib/marketplace/map-row";
import { addMyListingId } from "@/lib/marketplace/storage";
import { formatMoney } from "@/lib/format";
import { FormPage } from "@/components/shell/form-page";
import { SyncError } from "@/components/ui/sync-error";
import type {
  MarketplaceCategory,
  MarketplaceCondition,
  MarketplaceListing,
  MarketplaceSellerType
} from "@/types/agriculture";

const STEPS = ["Category", "Photos", "Details", "Price", "Preview", "Publish"] as const;

const CONDITIONS: MarketplaceCondition[] = ["new", "excellent", "good", "used", "fair"];

export function SellWizard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { farm } = useFarm();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<"selling" | "buying">("selling");
  const [category, setCategory] = useState<MarketplaceCategory>("livestock");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<MarketplaceCondition>("good");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState(farm.location);
  const [creatorName, setCreatorName] = useState(farm.name);
  const [contact, setContact] = useState("");
  const [sellerType, setSellerType] = useState<MarketplaceSellerType>("farmer");

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function onPickImage(file: File | null) {
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  async function publish() {
    setError(null);
    setSubmitting(true);
    try {
      const supabase = getSupabaseClient();
      const payload = marketplaceInsertPayload({
        type,
        title: title.trim() || "Untitled listing",
        description: description.trim() || undefined,
        contact: contact.trim() || undefined,
        creatorName: creatorName.trim() || undefined,
        category,
        priceAmount: price ? Number(price) : undefined,
        location: location.trim() || undefined,
        condition,
        sellerType,
        quantity: quantity.trim() || undefined
      });

      const { data, error: insertError } = await supabase
        .from("marketplace_listings")
        .insert(payload)
        .select("id")
        .single();

      if (insertError) {
        // Fallback for databases without extended columns
        const { data: legacy, error: legacyError } = await supabase
          .from("marketplace_listings")
          .insert({
            type,
            title: title.trim() || "Untitled listing",
            description: [description, quantity, location, price ? `Price: R${price}` : ""]
              .filter(Boolean)
              .join("\n"),
            contact: contact.trim() || null,
            creator_name: creatorName.trim() || null
          })
          .select("id")
          .single();
        if (legacyError) throw legacyError;
        if (legacy?.id && imageFile) {
          const imageUrl = await uploadItemImage(imageFile, "marketplace", legacy.id);
          await supabase.from("marketplace_listings").update({ image_url: imageUrl }).eq("id", legacy.id);
        }
        if (legacy?.id) addMyListingId(legacy.id);
      } else {
        const listingId = data?.id;
        if (listingId && imageFile) {
          const imageUrl = await uploadItemImage(imageFile, "marketplace", listingId);
          await supabase.from("marketplace_listings").update({ image_url: imageUrl }).eq("id", listingId);
        }
        if (listingId) addMyListingId(listingId);
      }

      queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
      router.push("/marketplace");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something didn't sync.");
    } finally {
      setSubmitting(false);
    }
  }

  const previewListing = {
    id: "preview",
    type,
    title: title || "Your listing title",
    description,
    quantity,
    location,
    creatorName,
    category,
    priceAmount: price ? Number(price) : undefined,
    condition,
    sellerType,
    verified: sellerType === "organisation",
    createdAt: new Date().toISOString(),
    imageUrl: imagePreview ?? undefined
  } satisfies Partial<MarketplaceListing> as MarketplaceListing;

  return (
    <FormPage
      backHref="/marketplace"
      backLabel="Back to marketplace"
      eyebrow="Trade"
      title="Create listing"
      description="A short guided flow — category, photos, details, price, then publish."
      image="/images/home/grain.jpg"
      contentClassName="max-w-2xl"
    >
      <ol className="flex gap-1 overflow-x-auto pb-1">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              index === step
                ? "bg-ink text-paper"
                : index < step
                  ? "bg-crop-soft text-crop"
                  : "bg-ivory-deep text-ink-subtle"
            }`}
          >
            {index < step ? "✓ " : ""}
            {label}
          </li>
        ))}
      </ol>

      {error && <SyncError message="Your draft is safe on this device. Check connection and try again." onRetry={publish} />}

      <div className="rounded-card border border-stone bg-paper p-5 md:p-6">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <p className="label-field">I want to</p>
              <div className="mt-2 flex gap-2">
                {(["selling", "buying"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={`min-h-11 flex-1 rounded-control border px-4 text-sm font-medium transition ${
                      type === value
                        ? "border-ink bg-ink text-paper"
                        : "border-stone-strong bg-ivory-deep text-ink-muted"
                    }`}
                  >
                    {value === "selling" ? "Sell something" : "Post a wanted ad"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label-field">Category</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {MARKETPLACE_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as MarketplaceCategory)}
                    className={`overflow-hidden rounded-control border text-left transition ${
                      category === cat.id ? "border-ink ring-2 ring-ink/10" : "border-stone"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.image} alt="" className="h-16 w-full object-cover" />
                    <span className="block px-2 py-2 text-xs font-medium text-ink">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-ink-muted">Add a clear photo — buyers trust listings with imagery.</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-control border border-dashed border-stone-strong bg-ivory/50 transition hover:bg-ivory"
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="max-h-48 rounded-control object-cover" />
              ) : (
                <>
                  <Camera className="h-8 w-8 text-ink-subtle" />
                  <span className="text-sm font-medium text-ink">Tap to add photos</span>
                </>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="label-field" htmlFor="title">Title</label>
              <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field mt-1" placeholder="e.g. Bonsmara Cattle" required />
            </div>
            <div>
              <label className="label-field" htmlFor="quantity">Quantity / size</label>
              <input id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="input-field mt-1" placeholder="e.g. 12 animals" />
            </div>
            <div>
              <label className="label-field" htmlFor="description">Details</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input-field mt-1" placeholder="Grade, breed, delivery, certifications…" />
            </div>
            <div>
              <label className="label-field" htmlFor="condition">Condition</label>
              <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value as MarketplaceCondition)} className="input-field mt-1">
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="label-field" htmlFor="price">Price (ZAR)</label>
              <input id="price" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className="input-field mt-1" placeholder="85000" />
              <p className="help-text">Leave blank for &quot;Price on request&quot;</p>
            </div>
            <div>
              <label className="label-field" htmlFor="location">Location</label>
              <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="input-field mt-1" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-ink-muted">Preview how buyers will see your listing.</p>
            <div className="overflow-hidden rounded-card border border-stone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={listingImage(previewListing)} alt="" className="aspect-[16/9] w-full object-cover" />
              <div className="space-y-2 p-4">
                <p className="text-xl font-semibold text-ink">
                  {price ? formatMoney(Number(price)) : "Price on request"}
                </p>
                <h3 className="text-lg font-semibold">{previewListing.title}</h3>
                {quantity && <p className="text-sm text-ink-muted">{quantity}</p>}
                {location && <p className="text-sm text-ink-subtle">{location}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <label className="label-field" htmlFor="seller">Seller name</label>
              <input id="seller" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} className="input-field mt-1" />
            </div>
            <div>
              <label className="label-field">Seller type</label>
              <div className="mt-2 flex gap-2">
                {(["farmer", "organisation"] as const).map((value) => (
                  <button key={value} type="button" onClick={() => setSellerType(value)} className={`min-h-10 flex-1 rounded-control border px-3 text-sm ${sellerType === value ? "border-ink bg-ink text-paper" : "border-stone-strong"}`}>
                    {value === "farmer" ? "Farmer" : "Organisation"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-field" htmlFor="contact">Contact</label>
              <input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} className="input-field mt-1" placeholder="Phone or WhatsApp" />
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          {step > 0 && (
            <button type="button" onClick={back} className="btn-secondary min-h-11 flex-1">
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary min-h-11 flex-1" disabled={step === 2 && !title.trim()}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={publish} disabled={submitting} className="btn-primary min-h-11 flex-1">
              {submitting ? "Publishing…" : "Publish listing"}
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </FormPage>
  );
}
