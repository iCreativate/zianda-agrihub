import type { Livestock, LivestockSpecies } from "@/types/agriculture";
import type { VaccinationScheduleRow } from "@/lib/supabase/hooks";

export function animalAgeLabel(dateOfBirth?: string) {
  if (!dateOfBirth) return "Age unknown";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "Age unknown";
  const days = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "Age unknown";
  if (days < 60) return `${days} day${days === 1 ? "" : "s"}`;
  const months = Math.floor(days / 30.4375);
  if (months < 24) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${years}y ${rem}mo` : `${years} yr${years === 1 ? "" : "s"}`;
}

export function speciesImage(species: LivestockSpecies | string) {
  switch (species) {
    case "sheep":
      return "/images/home/sheep.jpg";
    case "cattle":
      return "/images/home/livestock.jpg";
    case "goat":
      return "/images/home/farmer.jpg";
    default:
      return "/images/home/livestock.jpg";
  }
}

export function speciesLabel(species: string) {
  return species.charAt(0).toUpperCase() + species.slice(1);
}

export function animalStatus(
  animalId: string,
  schedule: VaccinationScheduleRow[]
): { label: string; tone: "crop" | "wheat" | "clay" } {
  const today = new Date().toISOString().slice(0, 10);
  const open = schedule.filter(
    (item) => item.livestockId === animalId && !item.completed
  );
  const overdue = open.filter((item) => item.scheduledDate < today);
  if (overdue.length > 0) return { label: "Needs care", tone: "clay" };
  if (open.length > 0) return { label: "Vaccination due", tone: "wheat" };
  return { label: "Healthy", tone: "crop" };
}

export type HerdOverviewMetrics = {
  total: number;
  cattle: number;
  sheep: number;
  goats: number;
  births: number;
  deaths: number;
  weightGainKg: number | null;
  vaccinationsDue: number;
  healthAlerts: number;
};

export function computeHerdMetrics(
  animals: Livestock[],
  schedule: VaccinationScheduleRow[],
  weightGains: number[]
): HerdOverviewMetrics {
  const today = new Date();
  const yearAgo = new Date(today);
  yearAgo.setFullYear(today.getFullYear() - 1);
  const yearAgoIso = yearAgo.toISOString().slice(0, 10);
  const todayIso = today.toISOString().slice(0, 10);
  const in30 = new Date(today);
  in30.setDate(today.getDate() + 30);
  const in30Iso = in30.toISOString().slice(0, 10);

  const open = schedule.filter((item) => !item.completed && item.livestockId);
  const dueSoon = open.filter(
    (item) => item.scheduledDate >= todayIso && item.scheduledDate <= in30Iso
  );
  const overdue = open.filter((item) => item.scheduledDate < todayIso);

  const gainTotal = weightGains.reduce((sum, value) => sum + value, 0);

  return {
    total: animals.length,
    cattle: animals.filter((a) => a.species === "cattle").length,
    sheep: animals.filter((a) => a.species === "sheep").length,
    goats: animals.filter((a) => a.species === "goat").length,
    births: animals.filter((a) => a.dateOfBirth && a.dateOfBirth >= yearAgoIso).length,
    deaths: 0,
    weightGainKg: weightGains.length ? Number(gainTotal.toFixed(1)) : null,
    vaccinationsDue: dueSoon.length,
    healthAlerts: overdue.length
  };
}
