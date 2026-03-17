"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function BurnVsYieldPage() {
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
          Burn vs projected yield
        </h1>
        <p className="text-sm text-slate-300">
          Understand how your monthly spending compares to the value you expect
          to harvest or sell from the farm.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-shell">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-50">
            <TrendingUp className="h-4 w-4 text-slate-400" />
            What is &quot;burn&quot;?
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Burn is the total amount you are spending in a given month across
            all categories.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>Feed, labour, medical, fertilizer, pesticide and equipment.</li>
            <li>
              Once you start recording more transactions, Zianda calculates your
              average monthly burn automatically.
            </li>
            <li>
              This number shows on the dashboard so you can quickly see if
              spend is trending up or down.
            </li>
          </ul>
        </div>

        <div className="card-shell">
          <h2 className="text-sm font-semibold text-slate-50">
            How projected yield is estimated
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Projected yield is based on the livestock and crop data you capture
            in the hub.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>
              For livestock, we use herd size and average sale price assumptions
              for calves, weaners or finished animals.
            </li>
            <li>
              For crops, we use area (ha or m²), typical yield per hectare and
              conservative farm gate prices.
            </li>
            <li>
              Over time these assumptions will become configurable for your
              specific farm.
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-300">
            The goal is to give you a simple &quot;spend vs potential income&quot;
            snapshot so you can decide when to slow down or speed up investment.
          </p>
        </div>
      </div>
    </div>
  );
}

