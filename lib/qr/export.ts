import jsPDF from "jspdf";

/** Pixel size for PNG/JPEG downloads. */
export const QR_EXPORT_SIZE = 2048;

/** Pixel size for A4 PDF embeds (~300 DPI across a large print area). */
export const QR_PDF_EXPORT_SIZE = 4096;

export type QrDownloadFormat = "png" | "jpeg" | "pdf";

export type QrExportMeta = {
  label?: string;
  detail?: string;
  qrValue?: string;
  scanUrl?: string;
};

function getCanvas(id: string) {
  return document.getElementById(id) as HTMLCanvasElement | null;
}

function findExportCanvas(preferredIds: string[] = []) {
  for (const id of preferredIds) {
    const canvas = getCanvas(id);
    if (canvas) return canvas;
  }
  return (
    (document.querySelector('canvas[id^="qr-export-png-"]') as HTMLCanvasElement | null) ||
    (document.querySelector('canvas[id^="qr-export-pdf-"]') as HTMLCanvasElement | null) ||
    (document.getElementById("created-qr-print") as HTMLCanvasElement | null)
  );
}

export function getQrDataUrl(
  format: "png" | "jpeg",
  canvasId: string,
  jpegQuality = 0.95
) {
  const canvas = getCanvas(canvasId);
  if (!canvas) return null;
  if (format === "jpeg") {
    const copy = document.createElement("canvas");
    copy.width = canvas.width;
    copy.height = canvas.height;
    const ctx = copy.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, copy.width, copy.height);
    ctx.drawImage(canvas, 0, 0);
    return copy.toDataURL("image/jpeg", jpegQuality);
  }
  return canvas.toDataURL("image/png");
}

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function downloadQrPng(filename: string, canvasId = "qr-export-png") {
  const dataUrl = getQrDataUrl("png", canvasId);
  if (!dataUrl) return false;
  triggerDownload(dataUrl, filename.endsWith(".png") ? filename : `${filename}.png`);
  return true;
}

export function downloadQrJpeg(filename: string, canvasId = "qr-export-png") {
  const dataUrl = getQrDataUrl("jpeg", canvasId);
  if (!dataUrl) return false;
  triggerDownload(
    dataUrl,
    filename.endsWith(".jpg") || filename.endsWith(".jpeg") ? filename : `${filename}.jpg`
  );
  return true;
}

/** Highest-res export: A4 portrait PDF with a large centered QR. */
export function downloadQrPdf(
  filenameBase: string,
  meta: QrExportMeta = {},
  canvasId = "qr-export-pdf"
) {
  const dataUrl = getQrDataUrl("png", canvasId);
  if (!dataUrl) return false;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const qrSize = Math.min(pageW - margin * 2, 160);

  doc.setFillColor(255, 252, 247);
  doc.rect(0, 0, pageW, pageH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(138, 132, 122);
  doc.text("ZIANDA AGRI-HUB", pageW / 2, margin, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(28, 25, 23);
  doc.text(meta.label || "Farm QR tag", pageW / 2, margin + 12, { align: "center" });

  if (meta.detail) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(87, 83, 78);
    doc.text(meta.detail, pageW / 2, margin + 20, { align: "center" });
  }

  const qrX = (pageW - qrSize) / 2;
  const qrY = margin + 28;
  doc.addImage(dataUrl, "PNG", qrX, qrY, qrSize, qrSize, undefined, "FAST");

  let y = qrY + qrSize + 12;
  if (meta.qrValue) {
    doc.setFont("courier", "bold");
    doc.setFontSize(14);
    doc.setTextColor(28, 25, 23);
    doc.text(meta.qrValue, pageW / 2, y, { align: "center" });
    y += 8;
  }

  if (meta.scanUrl) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(87, 83, 78);
    const lines = doc.splitTextToSize(meta.scanUrl, pageW - margin * 2);
    doc.text(lines, pageW / 2, y, { align: "center" });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(138, 132, 122);
  doc.text(
    `Print-ready A4 · ${QR_PDF_EXPORT_SIZE}×${QR_PDF_EXPORT_SIZE}px source · ${new Date().toLocaleDateString()}`,
    pageW / 2,
    pageH - 12,
    { align: "center" }
  );

  const name = filenameBase.endsWith(".pdf") ? filenameBase : `${filenameBase}.pdf`;
  doc.save(name);
  return true;
}

export function downloadQrAs(
  format: QrDownloadFormat,
  filenameBase: string,
  meta: QrExportMeta = {},
  ids: { png?: string; pdf?: string } = {}
) {
  const pngId = ids.png ?? "qr-export-png";
  const pdfId = ids.pdf ?? "qr-export-pdf";
  const safe = filenameBase.replace(/[^\w.-]+/g, "-");

  if (format === "png") return downloadQrPng(`${safe}.png`, pngId);
  if (format === "jpeg") return downloadQrJpeg(`${safe}.jpg`, pngId);
  return downloadQrPdf(safe, meta, pdfId);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * Opens a print-ready tag window without embedding a huge base64 payload
 * (which previously froze the popup on high-res canvases).
 */
export function printQrTag(meta: QrExportMeta, preferredCanvasIds: string[] = []) {
  const popup = window.open("", "_blank", "noopener,noreferrer,width=560,height=720");
  if (!popup) {
    window.alert("Allow pop-ups for this site to print the QR tag.");
    return false;
  }

  popup.document.open();
  popup.document.write(`<!doctype html>
<html>
  <head><title>Preparing tag…</title></head>
  <body style="font-family:system-ui,sans-serif;text-align:center;padding:48px;color:#57534e">
    <p>Preparing print tag…</p>
  </body>
</html>`);
  popup.document.close();

  const canvas = findExportCanvas(preferredCanvasIds);
  if (!canvas) {
    popup.document.body.innerHTML =
      "<p style='font-family:system-ui;padding:48px;text-align:center'>Could not prepare the QR image. Try Download as → PDF instead.</p>";
    return false;
  }

  canvas.toBlob((blob) => {
    if (!blob || popup.closed) return;
    const objectUrl = URL.createObjectURL(blob);
    const title = escapeHtml(meta.label || "Farm QR tag");
    const detail = escapeHtml(meta.detail || "");
    const qrValue = escapeHtml(meta.qrValue || "");
    const scanUrl = escapeHtml(meta.scanUrl || "");

    popup.document.open();
    popup.document.write(`<!doctype html>
<html>
  <head>
    <title>Zianda QR · ${title}</title>
    <style>
      @page { margin: 12mm; size: A4; }
      body { font-family: system-ui, sans-serif; text-align: center; padding: 24px; color: #1c1917; }
      img { width: 70mm; height: 70mm; image-rendering: pixelated; }
      h1 { font-size: 18px; margin: 16px 0 4px; }
      p { font-size: 13px; color: #57534e; margin: 4px 0; }
      .mono { font-family: ui-monospace, monospace; font-weight: 600; color: #1c1917; }
    </style>
  </head>
  <body>
    <img src="${objectUrl}" alt="QR code" />
    <h1>${title}</h1>
    ${detail ? `<p>${detail}</p>` : ""}
    ${qrValue ? `<p class="mono">${qrValue}</p>` : ""}
    ${scanUrl ? `<p>${scanUrl}</p>` : ""}
    <script>
      const img = document.querySelector("img");
      function go() {
        window.focus();
        window.print();
      }
      if (img && !img.complete) img.onload = go;
      else window.setTimeout(go, 50);
    </script>
  </body>
</html>`);
    popup.document.close();

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  }, "image/png");

  return true;
}

/** @deprecated use getQrDataUrl */
export function getQrPngDataUrl(canvasId = "qr-export-png") {
  return getQrDataUrl("png", canvasId);
}
