import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  PawPrint,
  Sprout,
  HeartPulse,
  Wallet,
  TrendingUp,
  Cog,
  ListChecks,
  FileText,
  QrCode,
  Settings2,
  Store,
  Leaf,
  BookOpen,
  Users,
  Bird
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: "exact" | "prefix";
  /** Extra paths that should mark this item active */
  aliases?: string[];
  /** Paths that must not mark this item active (checked before aliases/prefix) */
  exclude?: string[];
};

export const primaryNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, match: "exact" },
  { href: "/livestock", label: "Livestock", icon: PawPrint },
  { href: "/broilers", label: "Broilers", icon: Bird },
  { href: "/vegetation", label: "Crops", icon: Sprout },
  { href: "/vaccinations", label: "Health", icon: HeartPulse },
  {
    href: "/finances",
    label: "Expenses",
    icon: Wallet,
    match: "prefix",
    exclude: ["/finances/audit-report", "/finances/burn-vs-yield", "/income"]
  },
  {
    href: "/income",
    label: "Income",
    icon: TrendingUp,
    aliases: ["/finances/burn-vs-yield"]
  },
  {
    href: "/equipment",
    label: "Equipment",
    icon: Cog,
    aliases: ["/plant-machinery", "/motor", "/tools"]
  },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/finances/audit-report", label: "Reports", icon: FileText, match: "exact" },
  { href: "/scan", label: "QR Scanner", icon: QrCode },
  { href: "/settings", label: "Farm Settings", icon: Settings2 }
];

export const moreNav: NavItem[] = [
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/seeds", label: "Seeds", icon: Leaf },
  { href: "/farmer-hub", label: "Farmer hub", icon: Users },
  { href: "/education", label: "Education", icon: BookOpen },
  { href: "/lineage", label: "Lineage", icon: PawPrint }
];

export const quickAddItems = [
  { href: "/livestock/new", label: "Add animal" },
  { href: "/vegetation/new", label: "Add crop block" },
  { href: "/finances/new", label: "Log expense" },
  { href: "/marketplace/new", label: "Create listing" },
  { href: "/scan", label: "Scan QR" }
];

function pathMatches(pathname: string, href: string, mode: "exact" | "prefix" = "prefix") {
  if (mode === "exact") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isNavActive(pathname: string, item: NavItem) {
  if (item.exclude?.some((path) => pathMatches(pathname, path, "prefix"))) {
    return false;
  }
  if (item.aliases?.some((alias) => pathMatches(pathname, alias, "prefix"))) {
    return true;
  }
  return pathMatches(pathname, item.href, item.match ?? "prefix");
}

export function isMoreNavActive(pathname: string) {
  return moreNav.some((item) => isNavActive(pathname, item));
}
