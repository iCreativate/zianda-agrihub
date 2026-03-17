"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Store, TrendingUp, Users, Shield, Plus, Eye, Pencil, Trash2, RefreshCw } from "lucide-react";
import { useMarketplaceListings } from "@/lib/supabase/hooks";
import type { MarketplaceListing } from "@/types/agriculture";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";

const MY_LISTING_IDS_KEY = "zianda_marketplace_my_listing_ids";

function getMyListingIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MY_LISTING_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addMyListingId(id: string) {
  const ids = getMyListingIds();
  if (ids.includes(id)) return;
  ids.unshift(id);
  localStorage.setItem(MY_LISTING_IDS_KEY, JSON.stringify(ids));
}

function removeMyListingId(id: string) {
  const ids = getMyListingIds().filter((x) => x !== id);
  localStorage.setItem(MY_LISTING_IDS_KEY, JSON.stringify(ids));
}

const sellingTips = [
  { tip: "Know your cost", detail: "Use Finances and your crop/livestock records to work out cost per unit so you don't sell at a loss." },
  { tip: "Grade and describe clearly", detail: "State grade, size, moisture (if relevant) and any certifications so buyers know what they're getting." },
  { tip: "Timing", detail: "Plan harvest and sales around market demand and storage; avoid dumping when everyone else is selling." },
  { tip: "Traceability", detail: "Buyers and cooperatives often want proof of origin; use your Crops and Livestock records and QR codes where you have them." },
];

const buyingTips = [
  { tip: "Compare suppliers", detail: "Check price, quality, and delivery; build a short list of reliable suppliers for inputs and equipment." },
  { tip: "Bulk and timing", detail: "Order in bulk or off-season where it saves cost, and store correctly (e.g. seed, chemicals)." },
  { tip: "Record transactions", detail: "Log purchases in Finances and link to the relevant crop block or livestock group so your burn vs yield is accurate." },
];

type FilterType = "all" | "selling" | "buying";

function ListingCard({
  listing,
  isMine,
  onDelete,
  queryClient,
}: {
  listing: MarketplaceListing;
  isMine: boolean;
  onDelete?: () => void;
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  return (
    <li className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4 transition hover:border-slate-600/80">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {listing.imageUrl && (
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
            <img src={listing.imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${listing.type === "selling" ? "bg-emerald-500/20 text-emerald-300" : "bg-sky-500/20 text-sky-300"}`}>
            {listing.type === "selling" ? "Selling" : "Buying"}
          </span>
          {listing.creatorName && (
            <p className="mt-1 text-[11px] text-slate-500">Listed by {listing.creatorName}</p>
          )}
          <h3 className="mt-1 font-semibold text-slate-100">{listing.title}</h3>
          {listing.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">{listing.description}</p>
          )}
          {listing.contact && (
            <p className="mt-1 text-xs text-slate-500">Contact: {listing.contact}</p>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <Link
            href={`/marketplace/${listing.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
          {isMine && (
            <>
              <Link
                href={`/marketplace/${listing.id}/edit`}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.confirm("Delete this listing?")) {
                    onDelete?.();
                  }
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-950/30 px-2.5 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default function MarketplacePage() {
  const queryClient = useQueryClient();
  const { data: allListings = [], isLoading, isError, refetch } = useMarketplaceListings();
  const [myIds, setMyIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");

  // Sync "my listing" IDs from localStorage on mount only (allListings default [] is a new ref each render → loop)
  useEffect(() => {
    setMyIds(getMyListingIds());
  }, []);

  const filteredListings = useMemo(() => {
    if (filter === "all") return allListings;
    return allListings.filter((l) => l.type === filter);
  }, [allListings, filter]);

  const myListings = useMemo(() => allListings.filter((l) => myIds.includes(l.id)), [allListings, myIds]);

  async function handleDelete(id: string) {
    const supabase = getSupabaseClient();
    await supabase.from("marketplace_listings").delete().eq("id", id);
    removeMyListingId(id);
    setMyIds((prev) => prev.filter((x) => x !== id));
    queryClient.invalidateQueries({ queryKey: ["marketplace-listings"] });
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Marketplace
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Browse what other farmers are selling or looking for. Add your own listing to reach buyers and suppliers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="btn-secondary"
            title="Refresh listings"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link href="/marketplace/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            Add listing
          </Link>
        </div>
      </div>

      {myListings.length > 0 && (
        <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-3">Your listings ({myListings.length})</h2>
          <p className="text-xs text-slate-400 mb-4">Listings you added from this device. You can edit or delete them.</p>
          <ul className="space-y-3">
            {myListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isMine
                onDelete={() => handleDelete(listing.id)}
                queryClient={queryClient}
              />
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Browse all listings from farmers
          </h2>
          <div className="flex rounded-lg border border-slate-600 bg-slate-800/60 p-0.5">
            {(["all", "selling", "buying"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  filter === f ? "bg-slate-700 text-slate-100" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f === "all" ? "All" : f === "selling" ? "Selling" : "Buying"}
              </button>
            ))}
          </div>
        </div>
        {isError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            Could not load listings. Check your connection or Supabase.
          </p>
        )}
        {isLoading && (
          <p className="text-sm text-slate-400 py-4">Loading listings…</p>
        )}
        {!isLoading && !isError && filteredListings.length === 0 && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-8 text-center">
            <Store className="mx-auto h-10 w-10 text-slate-500" />
            <p className="mt-3 text-sm font-medium text-slate-300">No listings yet</p>
            <p className="mt-1 text-xs text-slate-500">
              {filter !== "all" ? "Try switching to All, or " : ""}Be the first to add a listing.
            </p>
            <Link href="/marketplace/new" className="btn-primary mt-4 inline-flex">
              <Plus className="h-4 w-4" />
              Add listing
            </Link>
          </div>
        )}
        {!isLoading && !isError && filteredListings.length > 0 && (
          <ul className="space-y-3">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isMine={myIds.includes(listing.id)}
                onDelete={myIds.includes(listing.id) ? () => handleDelete(listing.id) : undefined}
                queryClient={queryClient}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Selling your produce</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Whether you sell to a cooperative, abattoir, market, or direct to buyers, good records help you negotiate and prove quality. Use your{" "}
          <Link href="/vegetation" className="text-emerald-300 hover:underline">Crops</Link> and{" "}
          <Link href="/livestock" className="text-emerald-300 hover:underline">Livestock</Link> data to support claims about origin and management.
        </p>
        <ul className="space-y-3">
          {sellingTips.map((item, i) => (
            <li key={i} className="rounded-lg border border-slate-700/50 bg-slate-950/40 px-3 py-2">
              <p className="text-xs font-medium text-slate-100">{item.tip}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Store className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Buying inputs & equipment</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Seed, feed, fertilizer, chemicals, and equipment are major costs. Track them in{" "}
          <Link href="/finances" className="text-emerald-300 hover:underline">Finances</Link> and link to the right crop or livestock group so your dashboard and audit report are meaningful.
        </p>
        <ul className="space-y-3">
          {buyingTips.map((item, i) => (
            <li key={i} className="rounded-lg border border-slate-700/50 bg-slate-950/40 px-3 py-2">
              <p className="text-xs font-medium text-slate-100">{item.tip}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-50">Cooperatives & farmer groups</h2>
        </div>
        <p className="text-xs text-slate-300">
          Many cooperatives and buyer programmes require proof of production, vaccination records, or crop traceability. Keep your Livestock and Crops records up to date and use the{" "}
          <Link href="/education" className="text-emerald-300 hover:underline">Education</Link> section for guidance on vaccination calendars and QR traceability. Your{" "}
          <Link href="/finances/audit-report" className="text-emerald-300 hover:underline">audit report</Link> can support loan or grant applications.
        </p>
      </section>

      <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 px-4 py-4 text-sm text-slate-200">
        <div className="flex gap-2">
          <Shield className="h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-semibold text-slate-50">Fair dealing</p>
            <p className="mt-1 text-xs text-slate-300">
              Agree on price, quantity, quality, and payment terms before delivery. Get receipts and contracts in writing where possible. If you use the Marketplace to list or find offers, meet in safe, neutral places and verify buyers or sellers through your network or cooperative.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
