"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

export default function AuditReportInfoPage() {
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
          Audit &amp; investor report
        </h1>
        <p className="text-sm text-slate-300">
          Prepare a clean, professional PDF report that shows your herd, your
          records and your numbers in one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-shell">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-50">
            <FileText className="h-4 w-4 text-slate-400" />
            What will be in the report?
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Zianda Agri-Hub uses the data you capture to build an
            investment-ready report, including:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>
              Herd overview – number of animals by species, age group and
              production class.
            </li>
            <li>
              Health &amp; management snapshot – vaccinations completed,
              upcoming health tasks and mortality notes.
            </li>
            <li>
              Financial summary – total spend by category and simple profitability
              indicators.
            </li>
            <li>
              Crop block summary – area under production, main crops and input
              intensity.
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-300">
            This is the same information banks, investors and buyers ask for
            when they want to understand the risk and potential of your farm.
          </p>
        </div>

        <div className="card-shell">
          <h2 className="text-sm font-semibold text-slate-50">
            How it will work in Zianda
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            The &quot;Generate audit report&quot; button will soon use your live
            data to download a PDF.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>You record animals, crop blocks and transactions as normal.</li>
            <li>
              Zianda pulls that data together into a short, readable document.
            </li>
            <li>
              You can share the PDF with your bank, investor or cooperative with
              one click.
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-300">
            Under the hood this page will call the Zianda reporting engine to
            build the document automatically – no spreadsheets, no copy-paste.
          </p>
        </div>
      </div>
    </div>
  );
}

