import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "./client";
import type {
  Livestock,
  VegetationBlock,
  Transaction,
  MarketplaceListing,
  HealthTimelinePhoto,
  VaccinationRecord,
  SoilLog,
  InputScheduleItem
} from "@/types/agriculture";
import { decodeTimelineNotes } from "@/lib/livestock/timeline-notes";
import { mapMarketplaceRow } from "@/lib/marketplace/map-row";

export function useScanAssetById(id: string) {
  return useQuery({
    queryKey: ["scan-asset", id],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const raw = decodeURIComponent(id).trim();
      let lookup = raw;

      try {
        const url = new URL(raw);
        const scanMatch = url.pathname.match(/\/scan\/(.+)$/);
        if (scanMatch?.[1]) lookup = decodeURIComponent(scanMatch[1]);
        const livestockMatch = url.pathname.match(/\/livestock\/([0-9a-f-]{36})$/i);
        if (livestockMatch?.[1]) lookup = livestockMatch[1];
        const cropMatch = url.pathname.match(/\/vegetation\/([0-9a-f-]{36})$/i);
        if (cropMatch?.[1]) lookup = cropMatch[1];
      } catch {
        // plain tag id
      }

      const livestock = await findLivestockByTag(supabase, lookup);
      if (livestock) {
        return { type: "livestock" as const, data: livestock };
      }

      const block = await findVegetationByTag(supabase, lookup);
      if (block) {
        return { type: "vegetation" as const, data: block };
      }

      return null;
    },
    enabled: Boolean(id)
  });
}

async function findLivestockByTag(supabase: ReturnType<typeof getSupabaseClient>, tag: string) {
  const fields =
    "id, external_id, name, species, breed, date_of_birth, weight_kg, qr_code, photo_url, created_at, updated_at";

  const byExternal = await supabase
    .from("livestock")
    .select(fields)
    .eq("external_id", tag)
    .maybeSingle();
  if (byExternal.error) throw byExternal.error;
  if (byExternal.data) return mapLivestockRow(byExternal.data);

  const byQr = await supabase.from("livestock").select(fields).eq("qr_code", tag).maybeSingle();
  if (byQr.error) throw byQr.error;
  if (byQr.data) return mapLivestockRow(byQr.data);

  if (/^[0-9a-f-]{36}$/i.test(tag)) {
    const byId = await supabase.from("livestock").select(fields).eq("id", tag).maybeSingle();
    if (byId.error) throw byId.error;
    if (byId.data) return mapLivestockRow(byId.data);
  }

  return null;
}

async function findVegetationByTag(supabase: ReturnType<typeof getSupabaseClient>, tag: string) {
  const fields =
    "id, external_id, crop_type, variety, planting_date, area_hectares, qr_code, photo_url, created_at, updated_at";

  const byExternal = await supabase
    .from("vegetation_blocks")
    .select(fields)
    .eq("external_id", tag)
    .maybeSingle();
  if (byExternal.error) throw byExternal.error;
  if (byExternal.data) return mapVegetationRow(byExternal.data);

  const byQr = await supabase
    .from("vegetation_blocks")
    .select(fields)
    .eq("qr_code", tag)
    .maybeSingle();
  if (byQr.error) throw byQr.error;
  if (byQr.data) return mapVegetationRow(byQr.data);

  if (/^[0-9a-f-]{36}$/i.test(tag)) {
    const byId = await supabase
      .from("vegetation_blocks")
      .select(fields)
      .eq("id", tag)
      .maybeSingle();
    if (byId.error) throw byId.error;
    if (byId.data) return mapVegetationRow(byId.data);
  }

  return null;
}

function mapLivestockRow(livestock: any): Livestock {
  return {
    id: livestock.id,
    externalId: livestock.external_id,
    name: livestock.name,
    species: livestock.species,
    breed: livestock.breed ?? undefined,
    dateOfBirth: livestock.date_of_birth ?? undefined,
    weightKg: livestock.weight_kg ?? undefined,
    qrCode: livestock.qr_code ?? undefined,
    photoUrl: livestock.photo_url ?? undefined,
    createdAt: livestock.created_at,
    updatedAt: livestock.updated_at,
    vaccinationHistory: []
  };
}

function mapVegetationRow(block: any): VegetationBlock {
  return {
    id: block.id,
    externalId: block.external_id,
    cropType: block.crop_type,
    variety: block.variety ?? undefined,
    plantingDate: block.planting_date,
    areaHectares: block.area_hectares ?? undefined,
    qrCode: block.qr_code ?? undefined,
    photoUrl: block.photo_url ?? undefined,
    createdAt: block.created_at,
    updatedAt: block.updated_at
  };
}

export function useLivestockList() {
  return useQuery<Livestock[]>({
    queryKey: ["livestock-list"],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("livestock")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        externalId: row.external_id,
        name: row.name,
        species: row.species,
        breed: row.breed ?? undefined,
        dateOfBirth: row.date_of_birth ?? undefined,
        weightKg: row.weight_kg ?? undefined,
        qrCode: row.qr_code ?? undefined,
        photoUrl: row.photo_url ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    }
  });
}

export function useVegetationList() {
  return useQuery<VegetationBlock[]>({
    queryKey: ["vegetation-list"],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("vegetation_blocks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        externalId: row.external_id,
        cropType: row.crop_type,
        variety: row.variety ?? undefined,
        plantingDate: row.planting_date,
        areaHectares: row.area_hectares ?? undefined,
        qrCode: row.qr_code ?? undefined,
        photoUrl: row.photo_url ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    }
  });
}

interface DashboardMetrics {
  totalAssets: number;
  livestockCount: number;
  cropCount: number;
  upcomingVaccinations: number;
  monthlyBurn: number;
  projectedYield: number;
}

export function useDashboardMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const [
        { data: livestockRows, count: livestockCount },
        { data: vegetationRows, count: vegetationCount }
      ] = await Promise.all([
        supabase.from("livestock").select("id", { count: "exact" }),
        supabase.from("vegetation_blocks").select("id", { count: "exact" })
      ]);

      const livestockTotal =
        typeof livestockCount === "number" ? livestockCount : livestockRows?.length ?? 0;
      const cropTotal =
        typeof vegetationCount === "number" ? vegetationCount : vegetationRows?.length ?? 0;
      const totalAssets = livestockTotal + cropTotal;

      const today = new Date();
      const in30 = new Date();
      in30.setDate(today.getDate() + 30);

      const { data: upcomingVaccinationsData } = await supabase
        .from("vaccination_schedule_items")
        .select("id")
        .eq("completed", false)
        .gte("scheduled_date", today.toISOString().slice(0, 10))
        .lte("scheduled_date", in30.toISOString().slice(0, 10));

      const { data: monthlyTransactions } = await supabase
        .from("transactions")
        .select("*")
        .gte("date", new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10))
        .lte(
          "date",
          new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10)
        );

      const burn =
        (monthlyTransactions as Transaction[] | null)?.reduce((sum, t) => {
          const raw = (t as any).amount;
          const amt =
            typeof raw === "number"
              ? raw
              : raw === null || raw === undefined
              ? 0
              : Number(raw);
          return sum + (Number.isFinite(amt) ? amt : 0);
        }, 0) ?? 0;

      const projectedYield = burn * 1.2;

      return {
        totalAssets,
        livestockCount: livestockTotal,
        cropCount: cropTotal,
        upcomingVaccinations: upcomingVaccinationsData?.length ?? 0,
        monthlyBurn: burn,
        projectedYield
      };
    }
  });
}

export function useTransactions() {
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        date: row.date,
        amount:
          typeof row.amount === "number"
            ? row.amount
            : row.amount == null
            ? 0
            : Number(row.amount),
        currency: row.currency,
        category: row.category,
        description: row.description ?? undefined,
        livestockId: row.livestock_id ?? undefined,
        vegetationBlockId: row.vegetation_block_id ?? undefined,
        createdAt: row.created_at
      }));
    }
  });
}

export interface VaccinationScheduleRow {
  id: string;
  livestockId: string | null;
  vegetationBlockId: string | null;
  vaccineName: string;
  scheduledDate: string;
  completed: boolean;
  recommendedAgeDays: number;
  livestock?: {
    name: string;
    externalId: string;
    species: string;
  } | null;
  vegetationBlock?: {
    name: string;
    externalId: string;
    cropType: string;
  } | null;
}

export function useVaccinationSchedule(daysAhead = 120, daysBack = 14) {
  return useQuery<VaccinationScheduleRow[]>({
    queryKey: ["vaccination-schedule", daysAhead, daysBack],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const today = new Date();
      const future = new Date();
      future.setDate(today.getDate() + daysAhead);
      const past = new Date();
      past.setDate(today.getDate() - daysBack);

      const { data, error } = await supabase
        .from("vaccination_schedule_items")
        .select(
          `
            id,
            livestock_id,
            vegetation_block_id,
            vaccine_name,
            scheduled_date,
            completed,
            recommended_age_days,
            livestock:livestock (
              name,
              external_id,
              species
            )
          `
        )
        .gte("scheduled_date", past.toISOString().slice(0, 10))
        .lte("scheduled_date", future.toISOString().slice(0, 10))
        .order("scheduled_date", { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        livestockId: row.livestock_id ?? null,
        vegetationBlockId: row.vegetation_block_id ?? null,
        vaccineName: row.vaccine_name,
        scheduledDate: row.scheduled_date,
        completed: row.completed,
        recommendedAgeDays: row.recommended_age_days,
        livestock: row.livestock
          ? {
              name: row.livestock.name,
              externalId: row.livestock.external_id,
              species: row.livestock.species
            }
          : null,
        vegetationBlock: null
      }));
    }
  });
}

export interface LineageRow {
  id: string;
  relationship: "sire" | "dam";
  childId: string;
  parentId: string;
  child?: {
    name: string;
    externalId: string;
    species: string;
  } | null;
  parent?: {
    name: string;
    externalId: string;
    species: string;
  } | null;
}

export function useLineageOverview() {
  return useQuery<LineageRow[]>({
    queryKey: ["lineage-overview"],
    queryFn: async () => {
      const supabase = getSupabaseClient();

      const { data: lineageRows, error: lineageError } = await supabase
        .from("livestock_lineage")
        .select("id, livestock_id, parent_id, relationship");

      if (lineageError) throw lineageError;

      const rows = (lineageRows ?? []) as {
        id: string;
        livestock_id: string;
        parent_id: string;
        relationship: "sire" | "dam";
      }[];

      if (rows.length === 0) return [];

      const ids = Array.from(
        new Set(rows.flatMap((r) => [r.livestock_id, r.parent_id]))
      );

      const { data: animals, error: animalsError } = await supabase
        .from("livestock")
        .select("id, name, external_id, species")
        .in("id", ids);

      if (animalsError) throw animalsError;

      const byId =
        (animals ?? []).reduce<Record<string, { name: string; externalId: string; species: string }>>(
          (acc, a: any) => {
            acc[a.id] = {
              name: a.name,
              externalId: a.external_id,
              species: a.species
            };
            return acc;
          },
          {}
        );

      return rows.map((row) => ({
        id: row.id,
        relationship: row.relationship,
        childId: row.livestock_id,
        parentId: row.parent_id,
        child: byId[row.livestock_id] ?? null,
        parent: byId[row.parent_id] ?? null
      }));
    }
  });
}

export function useMarketplaceListings() {
  return useQuery<MarketplaceListing[]>({
    queryKey: ["marketplace-listings"],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: Record<string, unknown>) => mapMarketplaceRow(row));
    }
  });
}

export function useMarketplaceListing(id: string | null) {
  return useQuery<MarketplaceListing | null>({
    queryKey: ["marketplace-listing", id],
    queryFn: async () => {
      if (!id) return null;
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("marketplace_listings")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapMarketplaceRow(data as Record<string, unknown>);
    },
    enabled: Boolean(id)
  });
}

export function useAnimalHealthTimeline(animalId: string | null) {
  return useQuery<HealthTimelinePhoto[]>({
    queryKey: ["health-timeline", "livestock", animalId],
    enabled: Boolean(animalId),
    queryFn: async () => {
      if (!animalId) return [];
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("health_timeline_photos")
        .select("*")
        .eq("asset_type", "livestock")
        .eq("asset_id", animalId)
        .order("captured_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => {
        const payload = decodeTimelineNotes(row.notes);
        return {
          id: row.id,
          assetType: "livestock" as const,
          assetId: row.asset_id,
          capturedAt: row.captured_at,
          photoUrl: row.photo_url,
          notes: payload.note ?? row.notes ?? undefined,
          observation: payload.observation,
          treatment: payload.treatment,
          recoveryStatus: payload.recoveryStatus,
          weightKg: payload.weightKg,
          cropStage: payload.cropStage
        };
      });
    }
  });
}

export function useFieldHealthTimeline(blockId: string | null) {
  return useQuery<HealthTimelinePhoto[]>({
    queryKey: ["health-timeline", "vegetation", blockId],
    enabled: Boolean(blockId),
    queryFn: async () => {
      if (!blockId) return [];
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("health_timeline_photos")
        .select("*")
        .eq("asset_type", "vegetation")
        .eq("asset_id", blockId)
        .order("captured_at", { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row: any) => {
        const payload = decodeTimelineNotes(row.notes);
        return {
          id: row.id,
          assetType: "vegetation" as const,
          assetId: row.asset_id,
          capturedAt: row.captured_at,
          photoUrl: row.photo_url,
          notes: payload.note ?? row.notes ?? undefined,
          observation: payload.observation,
          treatment: payload.treatment,
          recoveryStatus: payload.recoveryStatus,
          cropStage: payload.cropStage
        };
      });
    }
  });
}

export function useFieldSoilLogs(blockId: string | null) {
  return useQuery<SoilLog[]>({
    queryKey: ["soil-logs", blockId],
    enabled: Boolean(blockId),
    queryFn: async () => {
      if (!blockId) return [];
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("soil_logs")
        .select("*")
        .eq("vegetation_block_id", blockId)
        .order("logged_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        vegetationBlockId: row.vegetation_block_id,
        timestamp: row.logged_at,
        ph: row.ph ?? undefined,
        moisturePercent: row.moisture_percent ?? undefined,
        notes: row.notes ?? undefined
      }));
    }
  });
}

export function useFieldInputSchedule(blockId: string | null) {
  return useQuery<InputScheduleItem[]>({
    queryKey: ["input-schedule", blockId],
    enabled: Boolean(blockId),
    queryFn: async () => {
      if (!blockId) return [];
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("input_schedule_items")
        .select("*")
        .eq("vegetation_block_id", blockId)
        .order("scheduled_date", { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        vegetationBlockId: row.vegetation_block_id,
        type: row.type,
        productName: row.product_name,
        dosage: row.dosage ?? undefined,
        scheduledDate: row.scheduled_date,
        appliedDate: row.applied_date ?? undefined,
        notes: row.notes ?? undefined
      }));
    }
  });
}

export function useFieldTransactions(blockId: string | null) {
  return useQuery<Transaction[]>({
    queryKey: ["field-transactions", blockId],
    enabled: Boolean(blockId),
    queryFn: async () => {
      if (!blockId) return [];
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("vegetation_block_id", blockId)
        .order("date", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        date: row.date,
        amount:
          typeof row.amount === "number"
            ? row.amount
            : row.amount == null
              ? 0
              : Number(row.amount),
        currency: row.currency,
        category: row.category,
        description: row.description ?? undefined,
        livestockId: row.livestock_id ?? undefined,
        vegetationBlockId: row.vegetation_block_id ?? undefined,
        createdAt: row.created_at
      }));
    }
  });
}

export function useAnimalVaccinationRecords(animalId: string | null) {
  return useQuery<VaccinationRecord[]>({
    queryKey: ["vaccination-records", animalId],
    enabled: Boolean(animalId),
    queryFn: async () => {
      if (!animalId) return [];
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("vaccination_records")
        .select("*")
        .eq("livestock_id", animalId)
        .order("scheduled_date", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        livestockId: row.livestock_id,
        vaccineName: row.vaccine_name,
        scheduledDate: row.scheduled_date,
        administeredDate: row.administered_date ?? undefined,
        veterinarian: row.veterinarian ?? undefined,
        notes: row.notes ?? undefined
      }));
    }
  });
}

export function useAnimalSchedule(animalId: string | null) {
  return useQuery<VaccinationScheduleRow[]>({
    queryKey: ["animal-vaccination-schedule", animalId],
    enabled: Boolean(animalId),
    queryFn: async () => {
      if (!animalId) return [];
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("vaccination_schedule_items")
        .select(
          `
            id,
            livestock_id,
            vegetation_block_id,
            vaccine_name,
            scheduled_date,
            completed,
            recommended_age_days,
            livestock:livestock (
              name,
              external_id,
              species
            )
          `
        )
        .eq("livestock_id", animalId)
        .order("scheduled_date", { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        livestockId: row.livestock_id ?? null,
        vegetationBlockId: row.vegetation_block_id ?? null,
        vaccineName: row.vaccine_name,
        scheduledDate: row.scheduled_date,
        completed: row.completed,
        recommendedAgeDays: row.recommended_age_days,
        livestock: row.livestock
          ? {
              name: row.livestock.name,
              externalId: row.livestock.external_id,
              species: row.livestock.species
            }
          : null,
        vegetationBlock: null
      }));
    }
  });
}

export function useAnimalLineage(animalId: string | null) {
  return useQuery<LineageRow[]>({
    queryKey: ["animal-lineage", animalId],
    enabled: Boolean(animalId),
    queryFn: async () => {
      if (!animalId) return [];
      const supabase = getSupabaseClient();
      const { data: rows, error } = await supabase
        .from("livestock_lineage")
        .select("id, livestock_id, parent_id, relationship")
        .eq("livestock_id", animalId);

      if (error) throw error;
      if (!rows?.length) return [];

      const parentIds = Array.from(new Set(rows.map((r: any) => r.parent_id as string)));
      const { data: parents, error: parentsError } = await supabase
        .from("livestock")
        .select("id, name, external_id, species")
        .in("id", parentIds);

      if (parentsError) throw parentsError;

      const byId = (parents ?? []).reduce<
        Record<string, { name: string; externalId: string; species: string }>
      >((acc, a: any) => {
        acc[a.id] = {
          name: a.name,
          externalId: a.external_id,
          species: a.species
        };
        return acc;
      }, {});

      return rows.map((row: any) => ({
        id: row.id,
        relationship: row.relationship as "sire" | "dam",
        childId: row.livestock_id,
        parentId: row.parent_id,
        child: null,
        parent: byId[row.parent_id] ?? null
      }));
    }
  });
}

