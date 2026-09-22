import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Zianda Agri-Hub",
  description:
    "Farm management platform for livestock, vegetation, costing, and QR-based health tracking."
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-ivory font-sans text-ink antialiased">
        <AppProviders>{props.children}</AppProviders>
      </body>
    </html>
  );
}
