"use client";

import Link from "next/link";
import { useScanAssetById } from "@/lib/supabase/hooks";
import {
  LivestockScanPassport,
  VegetationScanPassport
} from "@/components/scan/scan-passport";
import type { Livestock, VegetationBlock } from "@/types/agriculture";

interface ScanPageProps {
  params: { id: string };
}

export default function ScanPage(props: ScanPageProps) {
  const { id } = props.params;
  const { data, isLoading, isError } = useScanAssetById(id);

  const isLivestock = data?.type === "livestock";
  const isVegetation = data?.type === "vegetation";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <Link
        href="/scan"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
      >
        ← Back to Scan
      </Link>

      {isLoading && (
        <div className="rounded-card border border-stone bg-paper p-8 text-center shadow-soft">
          <p className="text-sm text-ink-muted">Looking up this tag on the platform…</p>
        </div>
      )}

      {isError && (
        <div className="alert-error">
          Unable to load this QR record. Check your connection or try again later.
        </div>
      )}

      {!isLoading && !isError && !data && (
        <div className="rounded-card border border-stone bg-paper p-8 shadow-soft">
          <h1 className="text-xl font-semibold tracking-tight text-ink">No record found</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Nothing on the platform matches tag{" "}
            <span className="font-mono font-medium text-ink">{decodeURIComponent(id)}</span>.
            It may have been deleted, not synced yet, or the QR points to a different ID.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/scan" className="btn-primary">
              Scan again
            </Link>
            <Link href="/livestock" className="btn-secondary">
              Browse herd
            </Link>
          </div>
        </div>
      )}

      {isLivestock && data?.data && (
        <LivestockScanPassport animal={data.data as Livestock} />
      )}

      {isVegetation && data?.data && (
        <VegetationScanPassport block={data.data as VegetationBlock} />
      )}
    </div>
  );
}
