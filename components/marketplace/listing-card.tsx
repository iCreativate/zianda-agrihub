"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BadgeCheck, Heart, MapPin } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { listingCategory, listingImage } from "@/lib/marketplace/constants";
import { isFavorite, toggleFavorite } from "@/lib/marketplace/storage";
import type { MarketplaceListing } from "@/types/agriculture";

function formatListingAge(createdAt: string) {
  const delta = Date.now() - Date.parse(createdAt);
  const days = Math.floor(delta / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function conditionLabel(
  condition: MarketplaceListing["condition"] | undefined,
  type: MarketplaceListing["type"]
) {
  if (!condition) return type === "buying" ? "Wanted" : "Available";
  return condition.charAt(0).toUpperCase() + condition.slice(1);
}

export function ListingCard(props: { listing: MarketplaceListing; isMine?: boolean }) {
  const { listing } = props;
  const [saved, setSaved] = useState(() => isFavorite(listing.id));
  const category = listingCategory(listing);
  const price =
    listing.priceAmount !== undefined && Number.isFinite(listing.priceAmount)
      ? formatMoney(listing.priceAmount, listing.priceCurrency ?? "ZAR")
      : "Price on request";

  return (
    <article className="home-market-card group overflow-hidden rounded-card border border-stone/90 bg-paper/95 shadow-soft backdrop-blur-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-ivory-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listingImage(listing)}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            className={`badge ${listing.type === "selling" ? "bg-paper/90 text-ink" : "bg-sky-soft text-sky"}`}
          >
            {listing.type === "selling" ? "For sale" : "Wanted"}
          </span>
          <span className="badge bg-paper/90 text-ink capitalize">{category}</span>
        </div>

        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save listing"}
          aria-pressed={saved}
          onClick={(e) => {
            e.preventDefault();
            setSaved(toggleFavorite(listing.id));
          }}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink-muted transition hover:text-clay"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-clay text-clay" : ""}`} />
        </button>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-lg font-semibold tracking-tight text-paper">{price}</p>
        </div>
      </div>

      <div className="space-y-3 p-4 md:p-5">
        <div>
          <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-ink">
            {listing.title}
          </h3>
          {listing.quantity && (
            <p className="mt-1 text-sm text-ink-muted">{listing.quantity}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
          {listing.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {listing.location}
            </span>
          )}
          <span>{formatListingAge(listing.createdAt)}</span>
          <span>{conditionLabel(listing.condition, listing.type)}</span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-stone pt-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {listing.creatorName ?? "Zianda farmer"}
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-crop">
              {(listing.verified || listing.sellerType === "organisation") && (
                <>
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {listing.sellerType === "organisation"
                    ? "Verified organisation"
                    : "Verified seller"}
                </>
              )}
              {!listing.verified && listing.sellerType !== "organisation" && listing.creatorName && (
                <>Local seller</>
              )}
            </p>
          </div>
          <Link href={`/marketplace/${listing.id}`} className="btn-primary min-h-10 shrink-0 px-4">
            View
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
