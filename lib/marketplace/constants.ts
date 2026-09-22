import type {
  MarketplaceCategory,
  MarketplaceCondition,
  MarketplaceListing,
  MarketplaceSellerType
} from "@/types/agriculture";

export const MARKETPLACE_CATEGORIES: Array<{
  id: MarketplaceCategory | "all";
  label: string;
  image: string;
}> = [
  { id: "all", label: "All", image: "/images/home/grain.jpg" },
  { id: "livestock", label: "Livestock", image: "/images/home/livestock.jpg" },
  { id: "crops", label: "Crops", image: "/images/home/crops.jpg" },
  { id: "produce", label: "Produce", image: "/images/home/grain.jpg" },
  { id: "equipment", label: "Equipment", image: "/images/home/machinery.jpg" },
  { id: "seeds", label: "Seeds", image: "/images/home/vegetables.jpg" },
  { id: "feed", label: "Feed", image: "/images/home/grain.jpg" },
  { id: "other", label: "Other", image: "/images/home/farmer.jpg" }
];

export const CONDITION_OPTIONS: Array<{ id: MarketplaceCondition | "all"; label: string }> = [
  { id: "all", label: "Any condition" },
  { id: "new", label: "New" },
  { id: "excellent", label: "Excellent" },
  { id: "good", label: "Good" },
  { id: "used", label: "Used" },
  { id: "fair", label: "Fair" }
];

export const SELLER_TYPE_OPTIONS: Array<{ id: MarketplaceSellerType | "all"; label: string }> = [
  { id: "all", label: "All sellers" },
  { id: "farmer", label: "Verified farmer" },
  { id: "organisation", label: "Verified organisation" }
];

export const CATEGORY_IMAGES: Record<MarketplaceCategory, string> = {
  livestock: "/images/home/livestock.jpg",
  crops: "/images/home/crops.jpg",
  produce: "/images/home/grain.jpg",
  equipment: "/images/home/machinery.jpg",
  seeds: "/images/home/vegetables.jpg",
  feed: "/images/home/grain.jpg",
  other: "/images/home/farmer.jpg"
};

export function inferCategoryFromTitle(title: string): MarketplaceCategory {
  const value = title.toLowerCase();
  if (/cattle|sheep|goat|pig|poultry|livestock|bonsmara|angus|brahman/.test(value)) return "livestock";
  if (/maize|wheat|soy|crop|field|hectare/.test(value)) return "crops";
  if (/produce|grain|harvest|vegetable|fruit/.test(value)) return "produce";
  if (/tractor|plough|planter|equipment|implement|motor|machinery/.test(value)) return "equipment";
  if (/seed/.test(value)) return "seeds";
  if (/feed|fertilizer|fertiliser|lick|supplement/.test(value)) return "feed";
  return "other";
}

export function listingCategory(listing: MarketplaceListing): MarketplaceCategory {
  return listing.category ?? inferCategoryFromTitle(listing.title);
}

export function listingImage(listing: MarketplaceListing): string {
  if (listing.imageUrl) return listing.imageUrl;
  return CATEGORY_IMAGES[listingCategory(listing)];
}
