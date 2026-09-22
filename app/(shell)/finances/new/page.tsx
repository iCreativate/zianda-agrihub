"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { FormPage } from "@/components/shell/form-page";
import type { TransactionCategory } from "@/types/agriculture";

const categories: TransactionCategory[] = [
  "feed",
  "labor",
  "medical",
  "fertilizer",
  "pesticide",
  "equipment",
  "other"
];

export default function NewTransactionPage() {
  const router = useRouter();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ZAR");
  const [category, setCategory] = useState<TransactionCategory>("feed");
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [linkType, setLinkType] = useState<"none" | "livestock" | "vegetation">("none");
  const [linkedId, setLinkedId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = getSupabaseClient();

    const amountNumber = Number(amount);
    if (!amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      setError("Please enter a valid amount greater than zero.");
      setSubmitting(false);
      return;
    }

    const baseDescription = description.trim();

    const payload: any = {
      date,
      amount: amountNumber,
      currency: currency.trim() || "ZAR",
      category,
      description:
        baseDescription ||
        (category === "other" && customCategory.trim()
          ? `Category: ${customCategory.trim()}`
          : null)
    };

    if (linkType === "livestock" && linkedId.trim()) {
      payload.livestock_id = linkedId.trim();
    } else if (linkType === "vegetation" && linkedId.trim()) {
      payload.vegetation_block_id = linkedId.trim();
    }

    try {
      const { error: insertError } = await supabase.from("transactions").insert(payload);

      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }

      router.push("/finances");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save transaction. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormPage
      backHref="/finances"
      backLabel="Back to finances"
      eyebrow="Books"
      title="Add transaction"
      description="Record a cost and optionally link it to a specific animal or crop block so reports stay meaningful."
      image="/images/home/finances.jpg"
    >
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div
            role="alert"
            className="alert-error"
          >
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label-field" htmlFor="tx-date">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="tx-amount">
              Amount
            </label>
            <input
              id="tx-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 150.00"
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="tx-currency">
              Currency
            </label>
            <input
              id="tx-currency"
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              className="input-field mt-1"
            />
            <p className="mt-1 text-xs text-ink-subtle">
              Default is South African rand (ZAR). Adjust only if you track in another currency.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="tx-category">
              Category
            </label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="input-field mt-1"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {category === "other" && (
              <>
                <label
                  className="mt-3 block text-xs font-medium text-ink-muted"
                  htmlFor="tx-custom-category"
                >
                  Custom category name
                </label>
                <input
                  id="tx-custom-category"
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. transport, rent"
                  className="input-field mt-1 text-sm"
                />
              </>
            )}
            <p className="mt-1 text-xs text-ink-subtle">
              This controls how the transaction appears in your summaries and burn-rate charts. If
              your category is not listed, choose &quot;Other&quot; and type your own name.
            </p>
          </div>

          <div>
            <label className="label-field">
              Link to an animal or crop block (optional)
            </label>
            <div className="mt-1 flex gap-2">
              <select
                aria-label="Link type"
                value={linkType}
                onChange={(e) => {
                  const next = e.target.value as "none" | "livestock" | "vegetation";
                  setLinkType(next);
                  setLinkedId("");
                }}
                className="input-field w-32"
              >
                <option value="none">None</option>
                <option value="livestock">Animal ID</option>
                <option value="vegetation">Crop block ID</option>
              </select>
              {linkType !== "none" && (
                <input
                  type="text"
                  value={linkedId}
                  onChange={(e) => setLinkedId(e.target.value)}
                  placeholder={
                    linkType === "livestock" ? "Livestock ID or QR ID" : "Crop block ID or QR ID"
                  }
                  className="input-field flex-1"
                />
              )}
            </div>
            <p className="mt-1 text-xs text-ink-subtle">
              Linking lets you see costs per animal or per field in future reports.
            </p>
          </div>
        </div>

        <div>
          <label className="label-field" htmlFor="tx-description">
            Notes (optional)
          </label>
          <textarea
            id="tx-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. 3 x 50kg bags of grower feed from local co-op."
            className="input-field mt-1"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? "Saving transaction…" : "Save transaction"}
        </button>
      </form>
    </FormPage>
  );
}

