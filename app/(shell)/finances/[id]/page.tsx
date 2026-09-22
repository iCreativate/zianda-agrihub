"use client";

import { FormPage } from "@/components/shell/form-page";
import Link from "next/link";
import { useMemo } from "react";
import {
  useLivestockList,
  useTransactions,
  useVegetationList
} from "@/lib/supabase/hooks";
import { formatMoney } from "@/lib/format";
import { cropLabel } from "@/lib/crops/stages";

interface FinanceDetailPageProps {
  params: { id: string };
}

export default function FinanceDetailPage({ params }: FinanceDetailPageProps) {
  const { data, isLoading } = useTransactions();
  const livestock = useLivestockList();
  const crops = useVegetationList();
  const tx = (data ?? []).find((t) => t.id === params.id);

  const linkedAnimal = useMemo(
    () => (livestock.data ?? []).find((animal) => animal.id === tx?.livestockId),
    [livestock.data, tx?.livestockId]
  );
  const linkedCrop = useMemo(
    () => (crops.data ?? []).find((block) => block.id === tx?.vegetationBlockId),
    [crops.data, tx?.vegetationBlockId]
  );

  const related = useMemo(() => {
    if (!tx) return [];
    return (data ?? [])
      .filter((row) => row.id !== tx.id && row.category === tx.category)
      .slice(0, 5);
  }, [data, tx]);

  if (isLoading) {
    return <p className="text-sm text-ink-muted">Loading transaction…</p>;
  }

  if (!tx) {
    return (
      <div className="space-y-4">
<p className="text-sm text-ink-muted">Transaction not found.</p>
      </div>
    );
  }

  return (
    <FormPage
      backHref="/finances"
      backLabel="Back to finances"
      eyebrow={tx.category}
      title={tx.description || "Transaction"}
      description={tx.date}
      image="/images/home/finances.jpg"
    >
      <section className="grid gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-3">
        <div className="bg-paper px-5 py-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">Amount</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">
            {formatMoney(tx.amount)}
          </p>
          <p className="mt-1 text-xs text-ink-subtle">{tx.currency}</p>
        </div>
        <div className="bg-paper px-5 py-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">Category</p>
          <p className="mt-3 text-2xl font-semibold capitalize tracking-tight">{tx.category}</p>
        </div>
        <div className="bg-paper px-5 py-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">Recorded</p>
          <p className="mt-3 text-sm font-medium text-ink">
            {new Date(tx.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short"
            })}
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="text-base font-semibold tracking-tight">Linked asset</h2>
          {!tx.livestockId && !tx.vegetationBlockId && (
            <p className="mt-3 text-sm text-ink-muted">
              This cost is not linked to an animal or crop block.
            </p>
          )}
          {linkedAnimal && (
            <Link
              href={`/livestock/${linkedAnimal.id}`}
              className="mt-3 flex min-h-11 items-center justify-between rounded-control border border-stone bg-ivory px-3 py-2.5"
            >
              <span>
                <span className="block text-sm font-medium">
                  {linkedAnimal.name || linkedAnimal.externalId}
                </span>
                <span className="block text-xs capitalize text-ink-subtle">
                  {linkedAnimal.species}
                  {linkedAnimal.breed ? ` · ${linkedAnimal.breed}` : ""}
                </span>
              </span>
              <span className="text-xs text-ink-subtle">Open →</span>
            </Link>
          )}
          {linkedCrop && (
            <Link
              href={`/vegetation/${linkedCrop.id}`}
              className="mt-3 flex min-h-11 items-center justify-between rounded-control border border-stone bg-ivory px-3 py-2.5"
            >
              <span>
                <span className="block text-sm font-medium">{linkedCrop.externalId}</span>
                <span className="block text-xs text-ink-subtle">
                  {cropLabel(linkedCrop.cropType, linkedCrop.variety)}
                </span>
              </span>
              <span className="text-xs text-ink-subtle">Open →</span>
            </Link>
          )}
          {(tx.livestockId || tx.vegetationBlockId) && !linkedAnimal && !linkedCrop && (
            <p className="mt-3 text-sm text-ink-muted">
              Linked asset could not be resolved. It may have been deleted.
            </p>
          )}
        </div>

        <div className="surface p-5">
          <h2 className="text-base font-semibold tracking-tight">Notes</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
            {tx.description || "No notes recorded for this transaction."}
          </p>
        </div>
      </section>

      <section className="surface p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold tracking-tight">
            Other {tx.category} costs
          </h2>
</div>
        {related.length === 0 ? (
          <p className="text-sm text-ink-muted">No other transactions in this category yet.</p>
        ) : (
          <div className="divide-y divide-stone">
            {related.map((row) => (
              <Link
                key={row.id}
                href={`/finances/${row.id}`}
                className="flex min-h-11 items-center justify-between gap-3 py-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {row.description || "Transaction"}
                  </span>
                  <span className="block text-xs text-ink-subtle">{row.date}</span>
                </span>
                <span className="text-sm font-semibold tabular-nums">{formatMoney(row.amount)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </FormPage>
  );
}
