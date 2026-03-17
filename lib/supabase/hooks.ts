import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "./client";
import type { Livestock, VegetationBlock, Transaction, MarketplaceListing } from "@/types/agriculture";

export function useScanAssetById(id: string) {
  return useQuery({
    queryKey: ["scan-asset", id],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data: livestock, error: lError } = await supabase
        .from("livestock")
        .select("*")
        .eq("external_id", id)
        .maybeSingle();

      if (lError) throw lError;

      if (livestock) {
        const mapped: Livestock = {
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
        return { type: "livestock" as const, data: mapped };
      }

      const { data: block, error: bError } = await supabase
        .from("vegetation_blocks")
        .select("*")
        .eq("external_id", id)
        .maybeSingle();

      if (bError) throw bError;

      if (block) {
        const mapped: VegetationBlock = {
          id: block.id,
          externalId: block.external_id,
          cropType: block.crop_type,
          variety: block.variety ?? undefined,
          plantingDate: block.planting_date,
          areaHectares: block.area_hectares ?? undefined,
          qrCode: block.qr_code ?? undefined,
          createdAt: block.created_at,
          updatedAt: block.updated_at
        };
        return { type: "vegetation" as const, data: mapped };
      }

      return null;
    },
    enabled: Boolean(id)
  });
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
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    }
  });
}

interface DashboardMetrics {
  totalAssets: number;
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

      const totalAssets =
        (typeof livestockCount === "number" ? livestockCount : livestockRows?.length ?? 0) +
        (typeof vegetationCount === "number" ? vegetationCount : vegetationRows?.length ?? 0);

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

      return (data ?? []).map((row: any) => ({
        id: row.id,
        type: row.type as MarketplaceListing["type"],
        title: row.title ?? "",
        description: row.description ?? undefined,
        contact: row.contact ?? undefined,
        creatorName: row.creator_name ?? undefined,
        imageUrl: row.image_url ?? undefined,
        createdAt: row.created_at
      }));
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

      return {
        id: data.id,
        type: data.type as MarketplaceListing["type"],
        title: data.title ?? "",
        description: data.description ?? undefined,
        contact: data.contact ?? undefined,
        creatorName: data.creator_name ?? undefined,
        imageUrl: data.image_url ?? undefined,
        createdAt: data.created_at
      };
    },
    enabled: Boolean(id)
  });
}



