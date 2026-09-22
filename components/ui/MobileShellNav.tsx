"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { BrandMark } from "@/components/ui/brand-mark";
import { Menu, X } from "lucide-react";

export function MobileShellNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-stone bg-paper text-ink shadow-soft transition hover:bg-ivory-deep md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/30"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-0 flex h-full w-[86vw] max-w-[320px] flex-col bg-paper shadow-lift">
            <div className="flex items-center justify-between border-b border-stone px-4 py-3">
              <div className="flex items-center gap-2.5">
                <BrandMark size="sm" />
                <p className="text-sm font-semibold text-ink">Zianda</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-stone bg-paper text-ink transition hover:bg-ivory-deep"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <Sidebar variant="drawer" onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
