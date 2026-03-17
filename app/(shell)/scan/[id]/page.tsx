"use client";

import Link from "next/link";
import { HealthCard } from "@/components/ui/health-card";
import { useScanAssetById } from "@/lib/supabase/hooks";
import { FarmAssistantPanel } from "@/components/ui/FarmAssistantPanel";
import { LivestockKnowledgePanel } from "@/components/ui/LivestockKnowledgePanel";
import type { Livestock, VegetationBlock } from "@/types/agriculture";
import type { CareContext } from "@/lib/assistant/care";

interface ScanPageProps {
  params: { id: string };
}

function buildCareContext(asset: Livestock | VegetationBlock | null): CareContext | null {
  if (!asset) return null;

  // Livestock vs crop determination follows HealthCard logic
  const isLivestock = (asset as Livestock).species !== undefined;

  if (isLivestock) {
    const a = asset as Livestock;
    let ageDays: number | undefined;
    if (a.dateOfBirth) {
      const dob = new Date(a.dateOfBirth);
      if (!Number.isNaN(dob.getTime())) {
        const diffMs = Date.now() - dob.getTime();
        ageDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }
    }
    return {
      kind: "livestock",
      species: a.species,
      ageDays,
    };
  }

  const block = asset as VegetationBlock;
  // Very simple stage inference based on planting date; can be refined later
  let stage: string | undefined;
  if (block.plantingDate) {
    const planted = new Date(block.plantingDate);
    if (!Number.isNaN(planted.getTime())) {
      const diffDays = Math.floor((Date.now() - planted.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 30) stage = "seedling";
      else if (diffDays < 90) stage = "flowering";
      else stage = "finishing";
    }
  }

  return {
    kind: "crop",
    cropType: String(block.cropType ?? "").toLowerCase(),
    stage,
  };
}

export default function ScanPage(props: ScanPageProps) {
  const { id } = props.params;
  const { data, isLoading, isError } = useScanAssetById(id);

  const asset = data?.data ?? null;
  const careContext = buildCareContext(asset);

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <Link
        href="/scan"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 transition hover:text-white"
      >
        ← Back to Scan
      </Link>

      {isLoading && (
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-6 text-center shadow-md shadow-black/40">
          <p className="text-sm text-slate-300">
            Loading health card from Zianda Agri-Hub…
          </p>
        </div>
      )}
      {isError && (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-4 shadow-md">
          <p className="text-sm text-red-200">
            Unable to load this QR record. Check your connection or try again later.
          </p>
        </div>
      )}
      {!isLoading && !isError && !asset && (
        <div className="rounded-2xl border border-amber-900/50 bg-amber-950/30 p-4 shadow-md">
          <p className="text-sm text-amber-200">
            No asset found for this QR code. It may have been deleted or not yet synced.
          </p>
        </div>
      )}
      {asset && <HealthCard asset={asset} />}
      {asset && (asset as Livestock).species && (
        <LivestockKnowledgePanel
          species={(asset as Livestock).species}
          breed={(asset as Livestock).breed}
        />
      )}
      {careContext && <FarmAssistantPanel context={careContext} />}
    </div>
  );
}
