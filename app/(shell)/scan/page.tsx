"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { QrCode, ArrowLeft } from "lucide-react";
import { BrowserQRCodeReader } from "@zxing/browser";

export default function ScanIndexPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = id.trim();
    if (trimmed) router.push(`/scan/${encodeURIComponent(trimmed)}`);
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanError(null);
    setScanning(true);

    try {
      const reader = new BrowserQRCodeReader();
      const objectUrl = URL.createObjectURL(file);
      try {
        const result = await reader.decodeFromImageUrl(objectUrl);
        let text = result.getText().trim();

        // If the QR contains a full URL, try to extract the /scan/{id} segment.
        try {
          const url = new URL(text);
          const match = url.pathname.match(/\/scan\/(.+)$/);
          if (match?.[1]) {
            text = decodeURIComponent(match[1]);
          }
        } catch {
          // not a URL, treat as plain ID
        }

        if (text) {
          router.push(`/scan/${encodeURIComponent(text)}`);
        } else {
          setScanError("Could not read a valid ID from this code. Try again.");
        }
      } finally {
        URL.revokeObjectURL(objectUrl);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch {
      setScanError(
        "We couldn't read that QR code. Try a clearer photo or move closer."
      );
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
          <QrCode className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-50">
          Scan health card
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Enter the ID from an animal or crop block QR code to view its health card,
          or scan a QR photo using your phone.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-700/40 bg-slate-900/80 p-6 shadow-md shadow-black/40"
      >
        <div>
          <label
            htmlFor="scan-id"
            className="block text-sm font-medium text-slate-200"
          >
            Asset or block ID
          </label>
          <input
            id="scan-id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="e.g. L-001 or B-Maize-1"
            className="mt-1 block w-full rounded-xl border border-slate-600 bg-slate-800/80 px-3 py-2.5 text-slate-50 placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
          />
        </div>
        <button
          type="submit"
          disabled={!id.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:opacity-95 disabled:opacity-50 disabled:shadow-none"
        >
          View health card
        </button>
      </form>

      <div className="space-y-3 rounded-2xl border border-slate-700/40 bg-slate-900/80 p-5 text-sm text-slate-300 shadow-md shadow-black/40">
        <p className="font-medium text-slate-100">Scan a QR code with your phone</p>
        <p className="text-xs text-slate-400">
          Take a photo of the QR code (or use your camera directly on mobile). Zianda will read the
          code and open the correct health card.
        </p>
        {scanError && (
          <p className="rounded-lg border border-amber-500/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-100">
            {scanError}
          </p>
        )}
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-600 bg-slate-800/70 px-4 py-2 text-xs font-medium text-slate-100 shadow-sm transition hover:border-emerald-400/60 hover:bg-slate-800">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="hidden"
          />
          {scanning ? "Reading code…" : "Choose or take a QR photo"}
        </label>
      </div>

      <p className="text-center text-sm text-slate-400">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-medium text-slate-200 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
