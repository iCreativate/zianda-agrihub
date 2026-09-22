import type { MarketplaceListing } from "@/types/agriculture";
import { listingCategory } from "@/lib/marketplace/constants";

const MY_LISTING_IDS_KEY = "zianda_marketplace_my_listing_ids";
const FAVORITES_KEY = "zianda_marketplace_favorites";

export function getMyListingIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MY_LISTING_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addMyListingId(id: string) {
  if (typeof window === "undefined") return;
  const ids = getMyListingIds();
  if (ids.includes(id)) return;
  ids.unshift(id);
  localStorage.setItem(MY_LISTING_IDS_KEY, JSON.stringify(ids));
}

export function removeMyListingId(id: string) {
  if (typeof window === "undefined") return;
  const ids = getMyListingIds().filter((x) => x !== id);
  localStorage.setItem(MY_LISTING_IDS_KEY, JSON.stringify(ids));
}

export function getFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(id: string): boolean {
  if (typeof window === "undefined") return false;
  const ids = getFavoriteIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next.includes(id);
}

export function isFavorite(id: string) {
  return getFavoriteIds().includes(id);
}

export type MarketplaceFilters = {
  query: string;
  category: string;
  intent: "all" | "selling" | "buying";
  location: string;
  priceMin: string;
  priceMax: string;
  condition: string;
  sellerType: string;
  sort: "newest" | "price-asc" | "price-desc" | "nearby";
};

export const DEFAULT_FILTERS: MarketplaceFilters = {
  query: "",
  category: "all",
  intent: "all",
  location: "",
  priceMin: "",
  priceMax: "",
  condition: "all",
  sellerType: "all",
  sort: "newest"
};

function locationScore(listingLocation: string | undefined, userLocation: string) {
  if (!listingLocation || !userLocation) return 0;
  const a = listingLocation.toLowerCase();
  const b = userLocation.toLowerCase();
  if (a === b) return 3;
  if (a.includes(b) || b.includes(a)) return 2;
  const aParts = a.split(/[\s,]+/);
  const bParts = b.split(/[\s,]+/);
  return aParts.some((part) => bParts.includes(part)) ? 1 : 0;
}

export function filterListings(
  listings: MarketplaceListing[],
  filters: MarketplaceFilters,
  userLocation?: string
) {
  const query = filters.query.trim().toLowerCase();
  const min = filters.priceMin ? Number(filters.priceMin) : null;
  const max = filters.priceMax ? Number(filters.priceMax) : null;

  let result = listings.filter((listing) => {
    if (filters.intent !== "all" && listing.type !== filters.intent) return false;
    if (filters.category !== "all" && listingCategory(listing) !== filters.category) return false;
    if (filters.condition !== "all" && listing.condition !== filters.condition) return false;
    if (filters.sellerType !== "all" && listing.sellerType !== filters.sellerType) return false;
    if (filters.location.trim()) {
      const loc = (listing.location ?? "").toLowerCase();
      if (!loc.includes(filters.location.trim().toLowerCase())) return false;
    }
    if (min !== null && Number.isFinite(min) && (listing.priceAmount ?? Infinity) < min) return false;
    if (max !== null && Number.isFinite(max) && (listing.priceAmount ?? 0) > max) return false;
    if (query) {
      const hay = `${listing.title} ${listing.description ?? ""} ${listing.creatorName ?? ""} ${listing.location ?? ""}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => {
    if (filters.sort === "price-asc") {
      return (a.priceAmount ?? Number.MAX_SAFE_INTEGER) - (b.priceAmount ?? Number.MAX_SAFE_INTEGER);
    }
    if (filters.sort === "price-desc") {
      return (b.priceAmount ?? 0) - (a.priceAmount ?? 0);
    }
    if (filters.sort === "nearby" && userLocation) {
      return locationScore(b.location, userLocation) - locationScore(a.location, userLocation);
    }
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });

  return result;
}

export function activeFilterCount(filters: MarketplaceFilters) {
  let count = 0;
  if (filters.category !== "all") count += 1;
  if (filters.intent !== "all") count += 1;
  if (filters.location.trim()) count += 1;
  if (filters.priceMin || filters.priceMax) count += 1;
  if (filters.condition !== "all") count += 1;
  if (filters.sellerType !== "all") count += 1;
  if (filters.sort !== "newest") count += 1;
  return count;
}
