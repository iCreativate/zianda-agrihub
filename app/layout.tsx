import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "Zianda Agri-Hub",
  description:
    "Farm management platform for livestock, vegetation, costing, and QR-based health tracking."
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AppProviders>{props.children}</AppProviders>
      </body>
    </html>
  );
}

