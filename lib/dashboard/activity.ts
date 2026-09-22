import { formatMoney, formatRelativeTime } from "@/lib/format";
import type { VaccinationScheduleRow } from "@/lib/supabase/hooks";
import type { Livestock, MarketplaceListing, Transaction, VegetationBlock } from "@/types/agriculture";

export type ActivityKind = "livestock" | "field" | "health" | "expense" | "sale";

export type ActivityEvent = {
  id: string;
  timestamp: number;
  timeLabel: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  href?: string;
};

export function buildActivityFeed(input: {
  livestock: Livestock[];
  crops: VegetationBlock[];
  transactions: Transaction[];
  vaccinations: VaccinationScheduleRow[];
  listings: MarketplaceListing[];
}): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (const animal of input.livestock) {
    const stamp = Date.parse(animal.updatedAt || animal.createdAt);
    if (!Number.isFinite(stamp)) continue;
    const created = animal.createdAt === animal.updatedAt;
    events.push({
      id: `animal-${animal.id}-${stamp}`,
      timestamp: stamp,
      timeLabel: formatRelativeTime(stamp),
      kind: "livestock",
      title: animal.name || animal.externalId,
      detail: created ? "Animal added to herd" : "Herd record updated",
      href: `/livestock/${animal.id}`
    });
  }

  for (const block of input.crops) {
    const stamp = Date.parse(block.updatedAt || block.createdAt);
    if (!Number.isFinite(stamp)) continue;
    const created = block.createdAt === block.updatedAt;
    events.push({
      id: `field-${block.id}-${stamp}`,
      timestamp: stamp,
      timeLabel: formatRelativeTime(stamp),
      kind: "field",
      title: block.externalId,
      detail: created ? "Field block created" : "Field record updated",
      href: `/vegetation/${block.id}`
    });
  }

  for (const row of input.transactions) {
    const stamp = Date.parse(row.createdAt || row.date);
    if (!Number.isFinite(stamp)) continue;
    events.push({
      id: `expense-${row.id}`,
      timestamp: stamp,
      timeLabel: formatRelativeTime(stamp),
      kind: "expense",
      title: "Expense",
      detail: `${formatMoney(row.amount)} recorded · ${row.category}`,
      href: "/finances"
    });
  }

  for (const row of input.vaccinations.filter((item) => item.completed)) {
    const stamp = Date.parse(row.scheduledDate);
    if (!Number.isFinite(stamp)) continue;
    events.push({
      id: `health-${row.id}`,
      timestamp: stamp,
      timeLabel: formatRelativeTime(stamp),
      kind: "health",
      title: row.vaccineName,
      detail: `Vaccination recorded for ${row.livestock?.name || row.livestock?.externalId || "livestock"}`,
      href: row.livestockId ? `/livestock/${row.livestockId}` : "/vaccinations"
    });
  }

  for (const listing of input.listings.filter((item) => item.type === "selling")) {
    const stamp = Date.parse(listing.createdAt);
    if (!Number.isFinite(stamp)) continue;
    events.push({
      id: `sale-${listing.id}`,
      timestamp: stamp,
      timeLabel: formatRelativeTime(stamp),
      kind: "sale",
      title: listing.title,
      detail: "Sale listing published",
      href: `/marketplace/${listing.id}`
    });
  }

  return events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 12);
}
