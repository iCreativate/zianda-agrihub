"use client";

import { useId, useState } from "react";
import { ChevronDown, Download, FileImage, FileType2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { PopoverMenu } from "@/components/ui/popover-menu";
import {
  downloadQrAs,
  QR_EXPORT_SIZE,
  QR_PDF_EXPORT_SIZE,
  type QrDownloadFormat,
  type QrExportMeta
} from "@/lib/qr/export";

const FORMATS: Array<{
  id: QrDownloadFormat;
  label: string;
  note: string;
  icon: typeof FileImage;
}> = [
  {
    id: "png",
    label: "PNG",
    note: `${QR_EXPORT_SIZE}×${QR_EXPORT_SIZE} · best for editing`,
    icon: FileImage
  },
  {
    id: "jpeg",
    label: "JPEG",
    note: `${QR_EXPORT_SIZE}×${QR_EXPORT_SIZE} · smaller file`,
    icon: FileImage
  },
  {
    id: "pdf",
    label: "PDF (A4)",
    note: `${QR_PDF_EXPORT_SIZE}×${QR_PDF_EXPORT_SIZE} on A4 · highest print res`,
    icon: FileType2
  }
];

export function QrDownloadAs(props: {
  value: string;
  filenameBase: string;
  meta?: QrExportMeta;
  className?: string;
  fullWidth?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const pngId = `qr-export-png-${uid}`;
  const pdfId = `qr-export-pdf-${uid}`;
  const [busy, setBusy] = useState<QrDownloadFormat | null>(null);

  function handleDownload(format: QrDownloadFormat) {
    setBusy(format);
    try {
      downloadQrAs(format, props.filenameBase, props.meta, {
        png: pngId,
        pdf: pdfId
      });
    } finally {
      window.setTimeout(() => setBusy(null), 250);
    }
  }

  return (
    <div className={props.className}>
      <div className="pointer-events-none fixed left-[-10000px] top-0" aria-hidden>
        <QRCodeCanvas
          id={pngId}
          value={props.value}
          size={QR_EXPORT_SIZE}
          includeMargin
          level="H"
          bgColor="#FFFFFF"
          fgColor="#1C1917"
        />
        <QRCodeCanvas
          id={pdfId}
          value={props.value}
          size={QR_PDF_EXPORT_SIZE}
          includeMargin
          level="H"
          bgColor="#FFFFFF"
          fgColor="#1C1917"
        />
      </div>

      <PopoverMenu
        align="left"
        side="auto"
        className={props.fullWidth ? "flex w-full" : undefined}
        trigger={
          <button
            type="button"
            className={`btn-primary min-h-12 ${props.fullWidth ? "w-full justify-center" : ""}`}
            disabled={Boolean(busy)}
          >
            <Download className="h-4 w-4" />
            {busy ? `Saving ${busy.toUpperCase()}…` : "Download as"}
            <ChevronDown className="h-4 w-4 opacity-70" />
          </button>
        }
      >
        {FORMATS.map((format) => {
          const Icon = format.icon;
          return (
            <button
              key={format.id}
              type="button"
              className="flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition hover:bg-ivory"
              onClick={() => handleDownload(format.id)}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{format.label}</span>
                <span className="block text-[11px] text-ink-subtle">{format.note}</span>
              </span>
            </button>
          );
        })}
      </PopoverMenu>
    </div>
  );
}
