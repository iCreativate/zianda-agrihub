import type { CropType, VegetationBlock } from "@/types/agriculture";
import type { WeatherSnapshot } from "@/lib/farm/use-weather";

export type CropStageId =
  | "planting"
  | "germination"
  | "growth"
  | "flowering"
  | "maturity"
  | "harvest";

export type CropStage = {
  id: CropStageId;
  label: string;
  day: number;
};

const STAGE_DAYS: Record<CropType, CropStage[]> = {
  maize: [
    { id: "planting", label: "Planting", day: 0 },
    { id: "germination", label: "Germination", day: 7 },
    { id: "growth", label: "Growth", day: 35 },
    { id: "flowering", label: "Flowering", day: 65 },
    { id: "maturity", label: "Maturity", day: 100 },
    { id: "harvest", label: "Harvest", day: 120 }
  ],
  wheat: [
    { id: "planting", label: "Planting", day: 0 },
    { id: "germination", label: "Germination", day: 10 },
    { id: "growth", label: "Growth", day: 40 },
    { id: "flowering", label: "Flowering", day: 75 },
    { id: "maturity", label: "Maturity", day: 110 },
    { id: "harvest", label: "Harvest", day: 130 }
  ],
  soybean: [
    { id: "planting", label: "Planting", day: 0 },
    { id: "germination", label: "Germination", day: 8 },
    { id: "growth", label: "Growth", day: 30 },
    { id: "flowering", label: "Flowering", day: 55 },
    { id: "maturity", label: "Maturity", day: 95 },
    { id: "harvest", label: "Harvest", day: 115 }
  ],
  vegetable: [
    { id: "planting", label: "Planting", day: 0 },
    { id: "germination", label: "Germination", day: 5 },
    { id: "growth", label: "Growth", day: 20 },
    { id: "flowering", label: "Flowering", day: 40 },
    { id: "maturity", label: "Maturity", day: 55 },
    { id: "harvest", label: "Harvest", day: 70 }
  ],
  fruit: [
    { id: "planting", label: "Planting", day: 0 },
    { id: "germination", label: "Germination", day: 14 },
    { id: "growth", label: "Growth", day: 60 },
    { id: "flowering", label: "Flowering", day: 120 },
    { id: "maturity", label: "Maturity", day: 180 },
    { id: "harvest", label: "Harvest", day: 220 }
  ],
  forage: [
    { id: "planting", label: "Planting", day: 0 },
    { id: "germination", label: "Germination", day: 7 },
    { id: "growth", label: "Growth", day: 25 },
    { id: "flowering", label: "Flowering", day: 45 },
    { id: "maturity", label: "Maturity", day: 60 },
    { id: "harvest", label: "Harvest", day: 75 }
  ],
  other: [
    { id: "planting", label: "Planting", day: 0 },
    { id: "germination", label: "Germination", day: 8 },
    { id: "growth", label: "Growth", day: 30 },
    { id: "flowering", label: "Flowering", day: 55 },
    { id: "maturity", label: "Maturity", day: 90 },
    { id: "harvest", label: "Harvest", day: 110 }
  ]
};

/** Rough ZAR/ha yield value used for overview forecasts when no sales data exists. */
const YIELD_VALUE_PER_HA: Record<CropType, number> = {
  maize: 18000,
  wheat: 14000,
  soybean: 16000,
  vegetable: 45000,
  fruit: 52000,
  forage: 8000,
  other: 12000
};

export function cropStages(cropType: CropType) {
  return STAGE_DAYS[cropType] ?? STAGE_DAYS.other;
}

export function daysSincePlanting(plantingDate?: string) {
  if (!plantingDate) return null;
  const planted = new Date(plantingDate);
  if (Number.isNaN(planted.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - planted.getTime()) / (1000 * 60 * 60 * 24)));
}

export function currentCropStage(cropType: CropType, plantingDate?: string): CropStage {
  const stages = cropStages(cropType);
  const days = daysSincePlanting(plantingDate);
  if (days === null) return stages[0];
  let current = stages[0];
  for (const stage of stages) {
    if (days >= stage.day) current = stage;
  }
  return current;
}

export function stageProgress(cropType: CropType, plantingDate?: string) {
  const stages = cropStages(cropType);
  const days = daysSincePlanting(plantingDate);
  const harvestDay = stages[stages.length - 1].day;
  if (days === null) return 0;
  return Math.min(100, Math.round((days / harvestDay) * 100));
}

export function expectedHarvestDate(cropType: CropType, plantingDate?: string) {
  if (!plantingDate) return null;
  const planted = new Date(plantingDate);
  if (Number.isNaN(planted.getTime())) return null;
  const harvestDay = cropStages(cropType)[cropStages(cropType).length - 1].day;
  const harvest = new Date(planted);
  harvest.setDate(harvest.getDate() + harvestDay);
  return harvest.toISOString().slice(0, 10);
}

export function cropImage(cropType: CropType | string) {
  switch (cropType) {
    case "maize":
    case "wheat":
    case "soybean":
    case "forage":
      return "/images/home/crops.jpg";
    case "vegetable":
      return "/images/home/vegetables.jpg";
    case "fruit":
      return "/images/home/grain.jpg";
    default:
      return "/images/home/aerial.jpg";
  }
}

export function cropLabel(cropType: string, variety?: string) {
  if (cropType === "other" && variety) return variety;
  return cropType.charAt(0).toUpperCase() + cropType.slice(1);
}

export function formatHectares(ha?: number | null) {
  if (ha == null || !Number.isFinite(ha) || ha <= 0) return "—";
  if (ha < 0.01) return `${Math.round(ha * 10000)} m²`;
  return `${Number(ha.toFixed(ha >= 10 ? 1 : 2))} ha`;
}

export function fieldHealth(
  stage: CropStage,
  weather?: WeatherSnapshot | null
): { label: string; tone: "crop" | "wheat" | "clay" | "sky" } {
  if (weather && [65, 82, 95].includes(weather.code)) {
    return { label: "Weather risk", tone: "clay" };
  }
  if (weather && [61, 63, 80, 81].includes(weather.code)) {
    return { label: "Watch moisture", tone: "wheat" };
  }
  if (stage.id === "harvest") return { label: "Ready", tone: "crop" };
  if (stage.id === "maturity") return { label: "Maturing", tone: "sky" };
  return { label: "On track", tone: "crop" };
}

export function weatherRiskLabel(weather?: WeatherSnapshot | null) {
  if (!weather) return { label: "—", note: "Weather unavailable" };
  if ([95, 65, 82].includes(weather.code)) {
    return { label: "High", note: weather.label };
  }
  if ([61, 63, 80, 81, 55].includes(weather.code)) {
    return { label: "Moderate", note: weather.label };
  }
  return { label: "Low", note: weather.label };
}

export type CropsOverviewMetrics = {
  totalHectares: number;
  activeFields: number;
  cropsPlanted: number;
  plantingProgress: number;
  nextHarvest: string | null;
  yieldForecast: number;
  weatherRisk: string;
  weatherNote: string;
  inputCosts: number;
};

export function computeCropsMetrics(
  blocks: VegetationBlock[],
  inputCosts: number,
  weather?: WeatherSnapshot | null
): CropsOverviewMetrics {
  const totalHectares = blocks.reduce((sum, block) => sum + (block.areaHectares || 0), 0);
  const cropTypes = new Set(blocks.map((block) => block.cropType));
  const progressValues = blocks.map((block) => stageProgress(block.cropType, block.plantingDate));
  const plantingProgress = progressValues.length
    ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
    : 0;

  const harvestDates = blocks
    .map((block) => expectedHarvestDate(block.cropType, block.plantingDate))
    .filter((value): value is string => Boolean(value))
    .sort();

  const yieldForecast = blocks.reduce((sum, block) => {
    const ha = block.areaHectares || 0;
    return sum + ha * (YIELD_VALUE_PER_HA[block.cropType] ?? YIELD_VALUE_PER_HA.other);
  }, 0);

  const risk = weatherRiskLabel(weather);

  return {
    totalHectares,
    activeFields: blocks.length,
    cropsPlanted: cropTypes.size,
    plantingProgress,
    nextHarvest: harvestDates[0] ?? null,
    yieldForecast,
    weatherRisk: risk.label,
    weatherNote: risk.note,
    inputCosts
  };
}
