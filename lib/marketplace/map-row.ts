import type { MarketplaceListing } from "@/types/agriculture";

export function mapMarketplaceRow(row: Record<string, unknown>): MarketplaceListing {
  return {
    id: String(row.id),
    type: row.type as MarketplaceListing["type"],
    title: String(row.title ?? ""),
    description: row.description ? String(row.description) : undefined,
    contact: row.contact ? String(row.contact) : undefined,
    creatorName: row.creator_name ? String(row.creator_name) : undefined,
    imageUrl: row.image_url ? String(row.image_url) : undefined,
    createdAt: String(row.created_at),
    category: row.category ? (row.category as MarketplaceListing["category"]) : undefined,
    priceAmount:
      row.price_amount !== null && row.price_amount !== undefined
        ? Number(row.price_amount)
        : undefined,
    priceCurrency: row.price_currency ? String(row.price_currency) : undefined,
    location: row.location ? String(row.location) : undefined,
    condition: row.condition ? (row.condition as MarketplaceListing["condition"]) : undefined,
    sellerType: row.seller_type
      ? (row.seller_type as MarketplaceListing["sellerType"])
      : undefined,
    quantity: row.quantity ? String(row.quantity) : undefined,
    verified: Boolean(row.verified)
  };
}

export function marketplaceInsertPayload(input: {
  type: MarketplaceListing["type"];
  title: string;
  description?: string;
  contact?: string;
  creatorName?: string;
  category?: MarketplaceListing["category"];
  priceAmount?: number;
  location?: string;
  condition?: MarketplaceListing["condition"];
  sellerType?: MarketplaceListing["sellerType"];
  quantity?: string;
}) {
  return {
    type: input.type,
    title: input.title,
    description: input.description ?? null,
    contact: input.contact ?? null,
    creator_name: input.creatorName ?? null,
    category: input.category ?? "other",
    price_amount: input.priceAmount ?? null,
    price_currency: "ZAR",
    location: input.location ?? null,
    condition: input.condition ?? null,
    seller_type: input.sellerType ?? "farmer",
    quantity: input.quantity ?? null,
    verified: input.sellerType === "organisation"
  };
}
