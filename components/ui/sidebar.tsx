"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PawPrint,
  Sprout,
  Wallet,
  BookOpen,
  QrCode,
  LogOut,
  Cog,
  Truck,
  Wrench,
  Leaf,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/livestock", label: "Livestock", icon: PawPrint },
  { href: "/vegetation", label: "Crops", icon: Sprout },
  { href: "/plant-machinery", label: "Plant and machinery", icon: Cog },
  { href: "/motor", label: "Motor (vehicles)", icon: Truck },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/seeds", label: "Seeds", icon: Leaf },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/farmer-hub", label: "Farmer hub", icon: BookOpen },
  { href: "/finances", label: "Finances", icon: Wallet },
  { href: "/education", label: "Education", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full min-h-screen w-64 shrink-0 flex-col border-r border-slate-800/60 bg-slate-900/80 shadow-xl shadow-black/30 backdrop-blur">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-slate-800/60 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-400 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/40">
          ZA
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-50">
            Zianda Agri-Hub
          </p>
          <p className="truncate text-xs text-slate-400">Farm dashboard</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-slate-800 text-slate-50 shadow-sm"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              )}
            >
              <item.icon
                className={cn("h-5 w-5 shrink-0", isActive ? "text-emerald-400" : "text-slate-400")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick scan + logout */}
      <div className="border-t border-slate-800/60 px-3 py-4 space-y-0.5">
        <Link
          href="/scan"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
            pathname === "/scan" || pathname.startsWith("/scan/")
              ? "bg-slate-800 text-slate-50 shadow-sm"
              : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
          )}
        >
          <QrCode
            className={cn(
              "h-5 w-5 shrink-0",
              pathname === "/scan" || pathname.startsWith("/scan/")
                ? "text-emerald-400"
                : "text-slate-400"
            )}
          />
          <span>Scan QR</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-slate-50"
        >
          <LogOut className="h-5 w-5 shrink-0 text-slate-500" />
          <span>Back to home</span>
        </Link>
      </div>
    </aside>
  );
}
