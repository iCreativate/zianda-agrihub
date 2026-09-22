import { currentCropStage, cropLabel } from "@/lib/crops/stages";
import type { VaccinationScheduleRow } from "@/lib/supabase/hooks";
import type { Livestock, VegetationBlock } from "@/types/agriculture";

export type AttentionTone = "urgent" | "attention" | "info";

export type AttentionItem = {
  id: string;
  tone: AttentionTone;
  title: string;
  context: string;
  dateLabel: string;
  actionLabel: string;
  href: string;
};

const TONE_LABEL: Record<AttentionTone, string> = {
  urgent: "Urgent",
  attention: "Attention",
  info: "Info"
};

export function attentionToneLabel(tone: AttentionTone) {
  return TONE_LABEL[tone];
}

export function buildAttentionItems(input: {
  vaccinations: VaccinationScheduleRow[];
  livestock: Livestock[];
  crops: VegetationBlock[];
  weatherWarning?: string | null;
}): AttentionItem[] {
  const today = new Date().toISOString().slice(0, 10);
  const items: AttentionItem[] = [];

  for (const item of input.vaccinations.filter((row) => !row.completed)) {
    const overdue = item.scheduledDate < today;
    const dueToday = item.scheduledDate === today;
    const animal = item.livestock?.name || item.livestock?.externalId || "Livestock";

    items.push({
      id: `vac-${item.id}`,
      tone: overdue ? "urgent" : dueToday ? "attention" : "attention",
      title: overdue ? `${item.vaccineName} overdue` : item.vaccineName,
      context: overdue
        ? `${animal} — vaccination was due ${formatShortDate(item.scheduledDate)}.`
        : dueToday
          ? `${animal} — due today.`
          : `${animal} — due ${formatShortDate(item.scheduledDate)}.`,
      dateLabel: formatShortDate(item.scheduledDate),
      actionLabel: overdue ? "Record now" : "View animal",
      href: item.livestockId ? `/livestock/${item.livestockId}` : "/vaccinations"
    });
  }

  for (const block of input.crops.slice(0, 4)) {
    const stage = currentCropStage(block.cropType, block.plantingDate);
    if (stage.id === "flowering" || stage.id === "maturity") {
      items.push({
        id: `field-${block.id}`,
        tone: "attention",
        title: block.externalId,
        context: `${cropLabel(block.cropType, block.variety)} — ${stage.label.toLowerCase()} stage. Field inspection recommended.`,
        dateLabel: "Today",
        actionLabel: "View field",
        href: `/vegetation/${block.id}`
      });
    }
  }

  for (const animal of input.livestock.filter((row) => !row.dateOfBirth).slice(0, 3)) {
    items.push({
      id: `dob-${animal.id}`,
      tone: "info",
      title: animal.name || animal.externalId,
      context: "Date of birth missing — vaccination schedule cannot be calculated.",
      dateLabel: "Record",
      actionLabel: "Complete profile",
      href: `/livestock/${animal.id}`
    });
  }

  if (input.weatherWarning) {
    items.unshift({
      id: "weather",
      tone: "attention",
      title: "Weather advisory",
      context: input.weatherWarning,
      dateLabel: "Today",
      actionLabel: "View tasks",
      href: "/tasks"
    });
  }

  const toneRank: Record<AttentionTone, number> = { urgent: 0, attention: 1, info: 2 };
  return items
    .sort((a, b) => toneRank[a.tone] - toneRank[b.tone])
    .slice(0, 6);
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function countOverdueTasks(vaccinations: VaccinationScheduleRow[]) {
  const today = new Date().toISOString().slice(0, 10);
  return vaccinations.filter((item) => !item.completed && item.scheduledDate < today).length;
}

export function countUrgentHealth(vaccinations: VaccinationScheduleRow[]) {
  const today = new Date().toISOString().slice(0, 10);
  const inSeven = new Date();
  inSeven.setDate(inSeven.getDate() + 7);
  const horizon = inSeven.toISOString().slice(0, 10);
  return vaccinations.filter(
    (item) => !item.completed && item.scheduledDate <= horizon && item.scheduledDate >= today
  ).length;
}
