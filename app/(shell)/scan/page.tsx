"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Keyboard,
  Loader2,
  PawPrint,
  Printer,
  QrCode,
  Sparkles,
  Sprout
} from "lucide-react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { QRCodeCanvas } from "qrcode.react";
import { useLivestockList, useVegetationList } from "@/lib/supabase/hooks";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";
import { printQrTag, QR_EXPORT_SIZE, QR_PDF_EXPORT_SIZE } from "@/lib/qr/export";
import { QrDownloadAs } from "@/components/scan/qr-download-as";

type Mode = "scan" | "create";
type CreateSource = "livestock" | "crop" | "custom";

export default function ScanIndexPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("scan");
  const [id, setId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const livestock = useLivestockList();
  const crops = useVegetationList();
  const [source, setSource] = useState<CreateSource>("livestock");
  const [selectedId, setSelectedId] = useState("");
  const [customTag, setCustomTag] = useState("");

  const animals = livestock.data ?? [];
  const blocks = crops.data ?? [];

  const created = useMemo(() => {
    if (source === "custom") {
      const tag = customTag.trim();
      if (!tag) return null;
      return {
        label: tag,
        detail: "Custom tag",
        qrValue: tag
      };
    }

    if (source === "livestock") {
      const animal = animals.find((item) => item.id === selectedId);
      if (!animal) return null;
      const qrValue = animal.qrCode || animal.externalId || animal.id;
      return {
        label: animal.name || animal.externalId,
        detail: `${animal.species}${animal.breed ? ` · ${animal.breed}` : ""}`,
        qrValue
      };
    }

    const block = blocks.find((item) => item.id === selectedId);
    if (!block) return null;
    const qrValue = block.qrCode || block.externalId || block.id;
    return {
      label: block.externalId,
      detail: `${block.cropType}${block.variety ? ` · ${block.variety}` : ""}`,
      qrValue
    };
  }, [animals, blocks, customTag, selectedId, source]);

  const scanUrl = useMemo(() => {
    if (!created) return "";
    const path = `/scan/${encodeURIComponent(created.qrValue)}`;
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  }, [created]);

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

        try {
          const url = new URL(text);
          const match = url.pathname.match(/\/scan\/(.+)$/);
          if (match?.[1]) {
            text = decodeURIComponent(match[1]);
          }
          const livestockMatch = url.pathname.match(/\/livestock\/([0-9a-f-]{36})$/i);
          if (livestockMatch?.[1]) {
            router.push(`/livestock/${livestockMatch[1]}`);
            return;
          }
          const cropMatch = url.pathname.match(/\/vegetation\/([0-9a-f-]{36})$/i);
          if (cropMatch?.[1]) {
            router.push(`/vegetation/${cropMatch[1]}`);
            return;
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
      setScanError("We couldn't read that QR code. Try a clearer photo or move closer.");
    } finally {
      setScanning(false);
    }
  }

  function printQr() {
    if (!created || !scanUrl) return;
    printQrTag(
      {
        label: created.label,
        detail: created.detail,
        qrValue: created.qrValue,
        scanUrl
      },
      ["created-qr-print"]
    );
  }

  return (
    <AppPage
      contentClassName="max-w-5xl"
      hero={
        <PageHero
          eyebrow="Field tags"
          title="QR scanner"
          description="Scan a tag to open the passport, or create a printable QR for an animal, field, or custom ID."
          image="/images/home/qr.jpg"
          imageAlt="QR scanning in the field"
          asideTitle="Tags"
          asideNote="Generated codes open the matching animal or field when scanned in Zianda."
          actions={
            <div className="flex w-full rounded-control border border-paper/20 bg-paper/10 p-1 backdrop-blur-sm">
              <ModeButton active={mode === "scan"} onClick={() => setMode("scan")}>
                <Camera className="h-4 w-4" />
                Scan
              </ModeButton>
              <ModeButton active={mode === "create"} onClick={() => setMode("create")}>
                <QrCode className="h-4 w-4" />
                Create
              </ModeButton>
            </div>
          }
        />
      }
    >

      {mode === "scan" ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
          <section className="overflow-hidden rounded-card border border-stone bg-paper shadow-soft">
            <div className="border-b border-stone bg-gradient-to-br from-ivory via-paper to-sky-soft/40 px-5 py-5 md:px-6">
              <p className="section-eyebrow">Camera</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink">
                Read a tag in the kraal
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Take a clear photo of the QR. We open the animal or field passport straight away.
              </p>
            </div>

            <div className="p-5 md:p-6">
              <label
                className={`group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed px-6 py-10 text-center transition ${
                  scanning
                    ? "border-crop/40 bg-crop-soft/40"
                    : "border-stone-strong bg-ivory hover:border-ink/25 hover:bg-paper"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={scanning}
                />
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${
                    scanning ? "bg-crop text-paper" : "bg-ink text-paper"
                  }`}
                >
                  {scanning ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6" />
                  )}
                </span>
                <span className="text-base font-semibold text-ink">
                  {scanning ? "Reading code…" : "Tap to scan with camera"}
                </span>
                <span className="max-w-xs text-sm text-ink-muted">
                  Hold steady, fill the frame, and avoid glare on the tag.
                </span>
              </label>

              {scanError && <p className="alert-warning mt-4">{scanError}</p>}
            </div>
          </section>

          <section className="surface flex flex-col p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-ink-subtle" />
              <h2 className="text-base font-semibold tracking-tight">Type a tag ID</h2>
            </div>
            <p className="text-sm text-ink-muted">
              If the camera can’t read the code, enter the animal or block ID printed on the tag.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col gap-4">
              <div>
                <label htmlFor="scan-id" className="label-field">
                  Animal / block ID
                </label>
                <input
                  id="scan-id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g. L-001"
                  className="input-field mt-1.5"
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={!id.trim()}
                className="btn-primary mt-auto min-h-12 w-full"
              >
                <QrCode className="h-4 w-4" />
                Open passport
              </button>
            </form>
          </section>

          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-2">
            <Tip
              title="Steady shot"
              note="Fill the frame with the square code and keep the phone parallel to the tag."
            />
            <Tip
              title="Light"
              note="Shade glossy tags — glare is the most common reason a scan fails."
            />
            <Tip
              title="After scan"
              note="You’ll see the animal’s recorded health, vaccinations, and timeline on the passport."
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
          <section className="overflow-hidden rounded-card border border-stone bg-paper shadow-soft">
            <div className="border-b border-stone bg-gradient-to-br from-ivory via-paper to-crop-soft/35 px-5 py-5 md:px-6">
              <p className="section-eyebrow">Build a tag</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink">
                Create a printable QR
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Link the code to an animal, a field, or any custom ID already on the record.
              </p>
            </div>

            <div className="space-y-6 p-5 md:p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                  Link to
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <SourceButton
                    active={source === "livestock"}
                    onClick={() => {
                      setSource("livestock");
                      setSelectedId("");
                    }}
                    icon={PawPrint}
                    label="Animal"
                    note="Herd tag"
                  />
                  <SourceButton
                    active={source === "crop"}
                    onClick={() => {
                      setSource("crop");
                      setSelectedId("");
                    }}
                    icon={Sprout}
                    label="Field"
                    note="Crop block"
                  />
                  <SourceButton
                    active={source === "custom"}
                    onClick={() => setSource("custom")}
                    icon={QrCode}
                    label="Custom"
                    note="Any ID"
                  />
                </div>
              </div>

              {source === "livestock" && (
                <div>
                  <label htmlFor="qr-animal" className="label-field">
                    Choose animal
                  </label>
                  <select
                    id="qr-animal"
                    className="input-field mt-1.5"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                  >
                    <option value="">
                      {livestock.isLoading ? "Loading herd…" : "Select an animal"}
                    </option>
                    {animals.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.name || animal.externalId}
                        {animal.externalId && animal.name ? ` (${animal.externalId})` : ""}
                      </option>
                    ))}
                  </select>
                  {!livestock.isLoading && animals.length === 0 && (
                    <p className="help-text">
                      No animals yet.{" "}
                      <Link
                        href="/livestock/new"
                        className="font-medium text-ink underline-offset-2 hover:underline"
                      >
                        Add one
                      </Link>{" "}
                      first.
                    </p>
                  )}
                </div>
              )}

              {source === "crop" && (
                <div>
                  <label htmlFor="qr-field" className="label-field">
                    Choose field
                  </label>
                  <select
                    id="qr-field"
                    className="input-field mt-1.5"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                  >
                    <option value="">
                      {crops.isLoading ? "Loading fields…" : "Select a field"}
                    </option>
                    {blocks.map((block) => (
                      <option key={block.id} value={block.id}>
                        {block.externalId}
                        {block.cropType ? ` · ${block.cropType}` : ""}
                      </option>
                    ))}
                  </select>
                  {!crops.isLoading && blocks.length === 0 && (
                    <p className="help-text">
                      No fields yet.{" "}
                      <Link
                        href="/vegetation/new"
                        className="font-medium text-ink underline-offset-2 hover:underline"
                      >
                        Add a field
                      </Link>{" "}
                      first.
                    </p>
                  )}
                </div>
              )}

              {source === "custom" && (
                <div>
                  <label htmlFor="qr-custom" className="label-field">
                    Custom tag ID
                  </label>
                  <input
                    id="qr-custom"
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="e.g. L-042 or BLOCK-A"
                    className="input-field mt-1.5"
                  />
                  <p className="help-text">
                    Use the same ID stored on the animal or field so scanning opens the right
                    passport.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-card border border-stone bg-paper shadow-soft">
            <div className="border-b border-stone px-5 py-4">
              <p className="section-eyebrow">Preview</p>
              <h2 className="mt-1 text-base font-semibold tracking-tight">Print-ready tag</h2>
            </div>

            <div className="flex flex-col items-center p-5 text-center md:p-6">
              {created && scanUrl ? (
                <>
                  <div className="rounded-card border border-stone bg-ivory p-4 shadow-soft">
                    <div className="rounded-control bg-paper p-3">
                      <QRCodeCanvas value={scanUrl} size={200} includeMargin level="H" />
                    </div>
                  </div>
                  <div
                    className="pointer-events-none fixed left-[-10000px] top-0"
                    aria-hidden
                  >
                    <QRCodeCanvas
                      id="created-qr-print"
                      value={scanUrl}
                      size={QR_EXPORT_SIZE}
                      includeMargin
                      level="H"
                      bgColor="#FFFFFF"
                      fgColor="#1C1917"
                    />
                  </div>
                  <p className="mt-5 text-lg font-semibold tracking-tight text-ink">
                    {created.label}
                  </p>
                  <p className="mt-1 text-sm capitalize text-ink-muted">{created.detail}</p>
                  <p className="mt-3 rounded-control bg-ivory px-3 py-1.5 font-mono text-sm font-medium text-ink">
                    {created.qrValue}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink-subtle">
                    <Sparkles className="h-3.5 w-3.5" />
                    PNG/JPEG {QR_EXPORT_SIZE}px · PDF A4 at {QR_PDF_EXPORT_SIZE}px
                  </p>
                  <div className="mt-5 flex w-full flex-col gap-2">
                    <QrDownloadAs
                      fullWidth
                      value={scanUrl}
                      filenameBase={`zianda-qr-${created.qrValue}`}
                      meta={{
                        label: created.label,
                        detail: created.detail,
                        qrValue: created.qrValue,
                        scanUrl
                      }}
                    />
                    <button
                      type="button"
                      onClick={printQr}
                      className="btn-secondary min-h-11 w-full"
                    >
                      <Printer className="h-4 w-4" />
                      Print tag
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex w-full flex-col items-center justify-center rounded-card border border-dashed border-stone-strong bg-ivory px-5 py-14">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink-subtle">
                    <QrCode className="h-6 w-6" />
                  </span>
                  <p className="mt-4 text-sm font-medium text-ink">No tag selected yet</p>
                  <p className="mt-1 max-w-[220px] text-sm text-ink-muted">
                    Pick an animal, field, or custom ID to preview the QR.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone pt-2">
        <Link
          href="/livestock"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to herd
        </Link>
        <Link href="/vegetation" className="link-quiet">
          Browse fields
        </Link>
      </div>
    </AppPage>
  );
}

function Tip(props: { title: string; note: string }) {
  return (
    <div className="rounded-card border border-stone bg-paper px-4 py-4 shadow-soft">
      <p className="text-sm font-semibold text-ink">{props.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{props.note}</p>
    </div>
  );
}

function ModeButton(props: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[8px] px-3 text-sm font-semibold transition ${
        props.active
          ? "bg-paper text-ink shadow-soft"
          : "text-ink-muted hover:text-ink"
      }`}
    >
      {props.children}
    </button>
  );
}

function SourceButton(props: {
  active: boolean;
  onClick: () => void;
  icon: typeof PawPrint;
  label: string;
  note: string;
}) {
  const Icon = props.icon;
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`flex min-h-[76px] flex-col items-start justify-center gap-1 rounded-control border px-3 py-2.5 text-left transition ${
        props.active
          ? "border-ink/20 bg-ivory text-ink shadow-soft"
          : "border-stone bg-paper text-ink-muted hover:border-stone-strong hover:text-ink"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-semibold">{props.label}</span>
      <span className="text-[11px] text-ink-subtle">{props.note}</span>
    </button>
  );
}
