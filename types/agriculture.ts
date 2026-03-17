export type LivestockSpecies =
  | "cattle"
  | "goat"
  | "sheep"
  | "poultry"
  | "pig"
  | "dog"
  | "other";

export interface VaccinationRecord {
  id: string;
  livestockId: string;
  vaccineName: string;
  scheduledDate: string;
  administeredDate?: string;
  veterinarian?: string;
  notes?: string;
}

export interface LineageRelation {
  parentId: string;
  relationship: "sire" | "dam";
}

export interface Livestock {
  id: string;
  externalId: string;
  name: string;
  species: LivestockSpecies;
  breed?: string;
  dateOfBirth?: string;
  weightKg?: number;
  qrCode?: string;
  photoUrl?: string;
  lineage?: LineageRelation[];
  vaccinationHistory?: VaccinationRecord[];
  createdAt: string;
  updatedAt: string;
}

export type CropType = "maize" | "wheat" | "soybean" | "vegetable" | "fruit" | "forage" | "other";

export interface SoilLog {
  id: string;
  vegetationBlockId: string;
  timestamp: string;
  ph?: number;
  moisturePercent?: number;
  notes?: string;
}

export interface InputScheduleItem {
  id: string;
  vegetationBlockId: string;
  type: "fertilizer" | "pesticide" | "herbicide";
  productName: string;
  dosage?: string;
  scheduledDate: string;
  appliedDate?: string;
  notes?: string;
}

export interface VegetationBlock {
  id: string;
  externalId: string;
  cropType: CropType;
  variety?: string;
  plantingDate: string;
  areaHectares?: number;
  qrCode?: string;
  soilLogs?: SoilLog[];
  inputSchedule?: InputScheduleItem[];
  createdAt: string;
  updatedAt: string;
}

export type TransactionCategory =
  | "feed"
  | "labor"
  | "medical"
  | "fertilizer"
  | "pesticide"
  | "equipment"
  | "other";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  category: TransactionCategory;
  description?: string;
  livestockId?: string;
  vegetationBlockId?: string;
  createdAt: string;
}

export type ContentCategory = "latest-trends" | "farmer-education";

export interface EducationContent {
  id: string;
  title: string;
  slug: string;
  category: ContentCategory;
  bodyMarkdown: string;
  author?: string;
  publishedAt?: string;
  createdAt: string;
}

export type AssetType = "livestock" | "vegetation";

export interface HealthTimelinePhoto {
  id: string;
  assetType: AssetType;
  assetId: string;
  capturedAt: string;
  photoUrl: string;
  notes?: string;
}

export interface MonthlySummary {
  month: string;
  totalExpenses: number;
  projectedYieldValue: number;
}

export interface VaccinationScheduleItem {
  id: string;
  livestockId: string;
  vaccineName: string;
  recommendedAgeDays: number;
  scheduledDate: string;
  completed: boolean;
}

export type MarketplaceListingType = "selling" | "buying";

export interface MarketplaceListing {
  id: string;
  type: MarketplaceListingType;
  title: string;
  description?: string;
  contact?: string;
  creatorName?: string;
  imageUrl?: string;
  createdAt: string;
}

