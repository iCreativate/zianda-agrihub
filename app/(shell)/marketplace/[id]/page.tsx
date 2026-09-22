"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Shield,
  Trash2
} from "lucide-react";
import { useMarketplaceListing } from "@/lib/supabase/hooks";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { formatMoney } from "@/lib/format";
import { listingCategory, listingImage } from "@/lib/marketplace/constants";
import { getMyListingIds, removeMyListingId } from "@/lib/marketplace/storage";
import { SyncError } from "@/components/ui/sync-error";
import { Skeleton } from "@/components/ui/skeleton";
import { AppPage } from "@/components/shell/app-page";
import { SubPageBanner } from "@/components/ui/sub-page-banner";

export default function MarketplaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { data: entry, isLoading, isError, refetch } = useMarketplaceListing(id);
  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    setIsMine(getMyListingIds().includes(id));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Delete this listing?")) return;
    const supabase = getSupabaseClient();
    await supabase.from("marketplace_listings").delete().eq("id", id);
    removeMyListingId(id);
    queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
    window.location.href = "/marketplace";
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="aspect-[16/9] w-full rounded-card" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !entry) {
    return (
      <div className="space-y-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 link-quiet">
          <ArrowLeft className="h-4 w-4" />
          Back to marketplace
        </Link>
        <SyncError onRetry={() => refetch()} />
      </div>
    );
  }

  const price =
    entry.priceAmount !== undefined && Number.isFinite(entry.priceAmount)
      ? formatMoney(entry.priceAmount, entry.priceCurrency ?? "ZAR")
      : "Price on request";

  const listedAge = new Date(entry.createdAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <AppPage
      hero={
        <SubPageBanner
          backHref="/marketplace"
          backLabel="Back to marketplace"
          eyebrow={listingCategory(entry)}
          title={entry.title}
          description={entry.quantity ?? undefined}
          image={listingImage(entry)}
          actions={
            isMine ? (
              <>
                <Link href={`/marketplace/${id}/edit`} className="btn-hero-secondary min-h-10">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
                <button type="button" onClick={handleDelete} className="btn-danger min-h-10">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            ) : undefined
          }
        />
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,380px)]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-card bg-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={listingImage(entry)}
              alt={entry.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-wheat capitalize">{listingCategory(entry)}</span>
              <span className={`badge ${entry.type === "selling" ? "badge-crop" : "badge-sky"}`}>
                {entry.type === "selling" ? "For sale" : "Wanted"}
              </span>
              {entry.condition && (
                <span className="badge bg-ivory-deep text-ink capitalize">{entry.condition}</span>
              )}
            </div>
            {entry.quantity && (
              <p className="mt-2 text-lg text-ink-muted">{entry.quantity}</p>
            )}
            {entry.description && (
              <p className="mt-4 max-w-2xl whitespace-pre-wrap text-[15px] leading-relaxed text-ink-muted">
                {entry.description}
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-stone bg-paper p-5 shadow-soft md:p-6">
            <p className="text-3xl font-semibold tracking-tight tabular-nums text-ink">{price}</p>
            {entry.location && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                <MapPin className="h-4 w-4 text-ink-subtle" />
                {entry.location}
              </p>
            )}

            {entry.contact && (
              <div className="mt-5 space-y-2">
                <a href={`tel:${entry.contact.replace(/\s/g, "")}`} className="btn-primary min-h-12 w-full">
                  <Phone className="h-4 w-4" />
                  Contact seller
                </a>
                <a
                  href={`https://wa.me/${entry.contact.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary min-h-12 w-full"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            )}
          </div>

          <div className="rounded-card border border-stone bg-ivory/40 p-5">
            <p className="section-eyebrow">Seller</p>
            <p className="mt-2 text-base font-semibold text-ink">
              {entry.creatorName ?? "Zianda farmer"}
            </p>
            <div className="mt-3 space-y-2 text-sm text-ink-muted">
              {(entry.verified || entry.sellerType === "organisation") && (
                <p className="inline-flex items-center gap-1.5 text-crop">
                  <BadgeCheck className="h-4 w-4" />
                  {entry.sellerType === "organisation"
                    ? "Verified organisation"
                    : "Verified farmer"}
                </p>
              )}
              <p className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-ink-subtle" />
                Listed {listedAge}
              </p>
              <p className="inline-flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-ink-subtle" />
                Zianda agricultural network
              </p>
            </div>
          </div>
        </aside>
      </div>
    </AppPage>
  );
}
