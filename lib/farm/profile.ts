export type FarmProfile = {
  id: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
};

export const DEFAULT_FARM: FarmProfile = {
  id: "zianda-home",
  name: "Zianda Home Farm",
  location: "Free State, South Africa",
  lat: -29.0852,
  lon: 26.1596
};

export const AVAILABLE_FARMS: FarmProfile[] = [
  DEFAULT_FARM,
  {
    id: "highveld-camp",
    name: "Highveld Grazing Camp",
    location: "Mpumalanga, South Africa",
    lat: -25.5653,
    lon: 30.5277
  }
];

export const FARM_PROFILE_KEY = "zianda-active-farm";
export const FARM_PROFILE_EVENT = "zianda-farm-change";

export function readActiveFarm(): FarmProfile {
  if (typeof window === "undefined") return DEFAULT_FARM;
  try {
    const raw = localStorage.getItem(FARM_PROFILE_KEY);
    if (!raw) return DEFAULT_FARM;
    const parsed = JSON.parse(raw) as Partial<FarmProfile>;
    const known = AVAILABLE_FARMS.find((farm) => farm.id === parsed.id);
    return {
      ...(known ?? DEFAULT_FARM),
      ...parsed,
      name: parsed.name?.trim() || (known ?? DEFAULT_FARM).name,
      location: parsed.location?.trim() || (known ?? DEFAULT_FARM).location
    };
  } catch {
    return DEFAULT_FARM;
  }
}

export function writeActiveFarm(farm: FarmProfile) {
  localStorage.setItem(FARM_PROFILE_KEY, JSON.stringify(farm));
  window.dispatchEvent(new Event(FARM_PROFILE_EVENT));
}
