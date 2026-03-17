"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

export default function FinanceCategoriesPage() {
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
          Finance categories
        </h1>
        <p className="text-sm text-slate-300">
          Group your costs so you can quickly see where money is going in the
          livestock and crop side of your business.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-shell">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-50">
            <Wallet className="h-4 w-4 text-slate-400" />
            Core categories
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Zianda Agri-Hub starts you with simple but powerful categories that
            match how farmers already think about cash flow.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>
              <span className="font-medium">Feed</span> – concentrates, hay,
              silage, lick blocks and crop residues.
            </li>
            <li>
              <span className="font-medium">Labour</span> – permanent staff,
              casuals, contractors and family labour.
            </li>
            <li>
              <span className="font-medium">Medical</span> – vet visits,
              vaccines, dipping, deworming and treatments.
            </li>
            <li>
              <span className="font-medium">Fertilizer &amp; pesticide</span> –
              basal/top dressing, foliar feeds and crop protection.
            </li>
            <li>
              <span className="font-medium">Equipment</span> – repairs,
              maintenance, fuel and small tools.
            </li>
            <li>
              <span className="font-medium">Other</span> – anything that does
              not fit but you still want to track.
            </li>
          </ul>
        </div>

        <div className="card-shell">
          <h2 className="text-sm font-semibold text-slate-50">
            How categories power your reports
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Every transaction is assigned to one category. That means the
            dashboard and audit report can show you:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>Feed costs per animal or per crop block.</li>
            <li>Labour share of total monthly spend.</li>
            <li>
              Medical costs compared to deaths and culls to see if treatment is
              working.
            </li>
            <li>
              Fertilizer and pesticide spend per hectare so you can compare
              seasons.
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            As the product grows, you will be able to customise categories and
            download category-level reports for your accountant or advisor.
          </p>
        </div>
      </div>
    </div>
  );
}

