import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Zianda Agri-Hub — farm management for livestock, crops, and finances";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #1c1917 0%, #2d3b32 48%, #4f6f56 100%)",
          color: "#fffcf7",
          fontFamily: "ui-sans-serif, system-ui, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#c9a227"
          }}
        >
          Zianda Agri-Hub
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em"
            }}
          >
            Farm management built for the field
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: "rgba(255,252,247,0.78)" }}>
            Livestock · Crops · Broilers · Finances · QR health tracking
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(255,252,247,0.65)"
          }}
        >
          Record · Track · Sell with confidence
        </div>
      </div>
    ),
    { ...size }
  );
}
