"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, ArrowLeft, Trash2 } from "lucide-react";
import { useMarketplaceListing } from "@/lib/supabase/hooks";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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

function removeMyListingId(id: string) {
  const ids = getMyListingIds().filter((x) => x !== id);
  localStorage.setItem(MY_LISTING_IDS_KEY, JSON.stringify(ids));
}

export default function MarketplaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { data: entry, isLoading, isError } = useMarketplaceListing(id);
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

  if (isLoading) return <p className="text-sm text-slate-400">Loading…</p>;
  if (isError || !entry) {
    return (
      <div className="space-y-6">
        <Link href="/marketplace" className="text-sm font-medium text-slate-300 hover:text-white">
          ← Back to marketplace
        </Link>
        <p className="text-slate-300">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </Link>
        {isMine && (
          <div className="flex items-center gap-2">
            <Link href={`/marketplace/${id}/edit`} className="btn-primary">
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="btn-danger"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>
      <div className="card-shell space-y-4">
        {entry.imageUrl && (
          <div className="overflow-hidden rounded-xl bg-slate-800">
            <img src={entry.imageUrl} alt="" className="max-h-80 w-full object-contain" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${entry.type === "selling" ? "bg-emerald-500/20 text-emerald-300" : "bg-sky-500/20 text-sky-300"}`}>
            {entry.type === "selling" ? "Selling" : "Buying"}
          </span>
          <h1 className="text-xl font-semibold text-slate-50">{entry.title}</h1>
        </div>
        {entry.creatorName && (
          <p className="text-sm text-slate-400">Listed by <span className="text-slate-300">{entry.creatorName}</span></p>
        )}
        <dl className="grid gap-3 text-sm">
          {entry.description && (
            <div>
              <dt className="text-slate-400">Description</dt>
              <dd className="text-slate-200 whitespace-pre-wrap">{entry.description}</dd>
            </div>
          )}
          {entry.contact && (
            <div>
              <dt className="text-slate-400">Contact</dt>
              <dd className="text-slate-100">{entry.contact}</dd>
            </div>
          )}
          <div>
            <dt className="text-slate-400">Posted</dt>
            <dd className="text-slate-300">{new Date(entry.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
