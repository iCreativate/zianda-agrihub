"use client";

import { useOnline } from "@/lib/farm/use-online";

export function OfflineIndicator() {
  const online = useOnline();
  if (online) return null;

  return (
    <div
      className="border-b border-wheat/25 bg-wheat-soft/80 px-4 py-2 text-center text-sm text-ink md:px-5"
      role="status"
    >
      <span className="font-medium">Offline</span>
      <span className="text-ink-muted"> — changes will sync automatically when you&apos;re back online.</span>
    </div>
  );
}
