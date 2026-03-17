"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransactions } from "@/lib/supabase/hooks";

interface FinanceDetailPageProps {
  params: { id: string };
}

export default function FinanceDetailPage({ params }: FinanceDetailPageProps) {
  const router = useRouter();
  const { data } = useTransactions();
  const tx = (data ?? []).find((t) => t.id === params.id);

  if (!tx) {
    return (
      <div className="space-y-4">
        <Link
          href="/finances"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          ← Back to finances
        </Link>
        <p className="text-sm text-slate-300">Transaction not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/finances"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          ← Back to finances
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          {tx.description || "Transaction"}
        </h1>
        <p className="text-sm text-slate-300">
          {tx.date} • {tx.category} • {tx.currency}
        </p>
      </div>

      <div className="card-shell space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Amount
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-50">
              {tx.amount.toFixed(2)} {tx.currency}
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>Recorded at: {tx.createdAt}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Category
            </p>
            <p className="mt-1 text-sm text-slate-50">{tx.category}</p>
          </div>
          {(tx.livestockId || tx.vegetationBlockId) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Linked asset
              </p>
              <p className="mt-1 text-sm text-slate-50">
                {tx.livestockId
                  ? `Animal (${tx.livestockId})`
                  : `Crop block (${tx.vegetationBlockId})`}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                In future you will be able to click through to the linked profile from here.
              </p>
            </div>
          )}
        </div>

        {tx.description && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Notes
            </p>
            <p className="mt-1 text-sm text-slate-200 whitespace-pre-line">
              {tx.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

