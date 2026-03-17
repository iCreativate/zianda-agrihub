"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";

export function MobileShellNav() {
  const [open, setOpen] = useState(false);

  // Prevent background scroll when drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
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
        className="inline-flex items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/60 p-2 text-slate-200 shadow-sm transition hover:bg-slate-800 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute left-0 top-0 h-full w-[86vw] max-w-[320px]">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-800/60 bg-slate-900/90 px-4 py-3 backdrop-blur">
                <p className="text-sm font-semibold text-slate-50">Menu</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/60 p-2 text-slate-200 transition hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Sidebar already includes Scan + Back to home */}
              <div className="flex-1 overflow-auto">
                <div onClick={() => setOpen(false)}>
                  <Sidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

