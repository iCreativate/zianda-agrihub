"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Store } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryNav } from "@/components/marketplace/category-nav";
import { ListingCard } from "@/components/marketplace/listing-card";
import { ListingFilters } from "@/components/marketplace/listing-filters";
import { MarketplaceHero } from "@/components/marketplace/marketplace-hero";
import { AppPage } from "@/components/shell/app-page";
import { ListingCardSkeleton } from "@/components/ui/skeleton";
import { SyncError } from "@/components/ui/sync-error";
import { useFarm } from "@/lib/farm/use-farm";
import {
  DEFAULT_FILTERS,
  filterListings,
  getMyListingIds,
  removeMyListingId,
  type MarketplaceFilters
} from "@/lib/marketplace/storage";
import { useMarketplaceListings } from "@/lib/supabase/hooks";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function MarketplacePage() {
  const queryClient = useQueryClient();
  const { farm } = useFarm();
  const { data: allListings = [], isLoading, isError, refetch } = useMarketplaceListings();
  const [myIds, setMyIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    setMyIds(getMyListingIds());
  }, []);

  const filtered = useMemo(
    () => filterListings(allListings, filters, farm.location),
    [allListings, filters, farm.location]
  );

  const myListings = useMemo(
    () => allListings.filter((listing) => myIds.includes(listing.id)),
    [allListings, myIds]
  );

  function updateFilters(patch: Partial<MarketplaceFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this listing?")) return;
    const supabase = getSupabaseClient();
    await supabase.from("marketplace_listings").delete().eq("id", id);
    removeMyListingId(id);
    setMyIds((prev) => prev.filter((x) => x !== id));
    queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
  }

  return (
    <AppPage
      hero={
        <MarketplaceHero query={filters.query} onQueryChange={(query) => updateFilters({ query })} />
      }
    >
      <CategoryNav
        active={filters.category}
        onChange={(category) => updateFilters({ category })}
      />

      <ListingFilters filters={filters} onChange={setFilters} resultCount={filtered.length} />

      {myListings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Your listings</h2>
            <span className="text-sm text-ink-subtle">{myListings.length} active</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {myListings.map((listing) => (
              <div key={listing.id} className="relative">
                <ListingCard listing={listing} isMine />
                <button
                  type="button"
                  onClick={() => handleDelete(listing.id)}
                  className="absolute right-3 top-[calc(100%-3.5rem)] text-xs font-medium text-clay underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="section-eyebrow">Discover</p>
            <h2 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
              {filters.intent === "buying"
                ? "Farmers looking to buy"
                : filters.intent === "selling"
                  ? "For sale now"
                  : "All listings"}
            </h2>
          </div>
          <Link href="/marketplace/new" className="btn-primary hidden min-h-11 sm:inline-flex">
            <Plus className="h-4 w-4" />
            Sell something
          </Link>
        </div>

        {isError && <SyncError onRetry={() => refetch()} />}

        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((key) => (
              <ListingCardSkeleton key={key} />
            ))}
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="grid overflow-hidden rounded-card bg-paper md:grid-cols-[minmax(0,1fr)_280px]">
            <div className="flex flex-col justify-center px-6 py-10 md:px-10 md:py-12">
              <Store className="h-8 w-8 text-ink-subtle" />
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">No listings yet</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                Be the first farmer to list something. Reach buyers and suppliers across the Zianda
                network.
              </p>
              <Link href="/marketplace/new" className="btn-primary mt-6 min-h-12 w-fit">
                <Plus className="h-4 w-4" />
                Create listing
              </Link>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home/grain.jpg"
              alt=""
              className="hidden h-full min-h-[200px] w-full object-cover md:block"
            />
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} isMine={myIds.includes(listing.id)} />
            ))}
          </div>
        )}
      </section>
    </AppPage>
  );
}
