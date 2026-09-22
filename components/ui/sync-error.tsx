"use client";

import { RefreshCw } from "lucide-react";

export function SyncError(props: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-control border border-wheat/30 bg-wheat-soft px-4 py-4 md:px-5">
      <p className="font-medium text-ink">Something didn&apos;t sync</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        {props.message ??
          "Your records are safe. We'll try again when you're connected."}
      </p>
      {props.onRetry && (
        <button type="button" onClick={props.onRetry} className="btn-secondary mt-3 min-h-10">
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
}
