const KEY = "zianda-weight-history";

export type WeightPoint = {
  date: string;
  kg: number;
};

function readAll(): Record<string, WeightPoint[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, WeightPoint[]>;
  } catch {
    return {};
  }
}

export function readWeightHistory(animalId: string): WeightPoint[] {
  return readAll()[animalId] ?? [];
}

export function appendWeightPoint(animalId: string, kg: number, date = new Date().toISOString()) {
  const all = readAll();
  const next = [...(all[animalId] ?? []), { date, kg }];
  all[animalId] = next.slice(-24);
  localStorage.setItem(KEY, JSON.stringify(all));
  return all[animalId];
}

export function totalWeightGain(animalId: string) {
  const points = readWeightHistory(animalId);
  if (points.length < 2) return 0;
  return points[points.length - 1].kg - points[0].kg;
}
