import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

const siteName = "Zianda Agri-Hub";
const siteDescription =
  "Farm management for livestock, crops, finances, and QR health tracking — built for African farmers.";

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  if (process.env.URL) return process.env.URL.replace(/\/$/, "");
  return "http://localhost:3000";
}

const siteUrl = resolveSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "farm management",
    "livestock",
    "broilers",
    "crops",
    "agriculture",
    "QR health cards",
    "Zianda"
  ],
  authors: [{ name: "Zianda Agri-Hub" }],
  creator: "Zianda Agri-Hub",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription
  },
  robots: {
    index: true,
    follow: true
  }
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
