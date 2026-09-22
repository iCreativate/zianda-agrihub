"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PawPrint, Plus, QrCode, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { PopoverMenu } from "@/components/ui/popover-menu";
import { quickAddItems } from "@/components/shell/nav";

const dockItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/livestock", label: "Herd", icon: PawPrint },
  { href: "/vegetation", label: "Crops", icon: Sprout }
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-stone bg-paper/95 px-2 pt-1.5 backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-5 items-end">
        {dockItems.slice(0, 2).map((item) => (
          <DockLink
            key={item.href}
            {...item}
            active={item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)}
          />
        ))}

        <Link
          href="/scan"
          className="flex flex-col items-center justify-center pb-1"
          aria-label="Scan QR"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-lift">
            <QrCode className="h-5 w-5" />
          </span>
          <span className="mt-1 text-[10px] font-medium text-ink">Scan</span>
        </Link>

        {dockItems.slice(2).map((item) => (
          <DockLink
            key={item.href}
            {...item}
            active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
          />
        ))}

        <PopoverMenu
          align="right"
          side="top"
          className="flex w-full justify-center"
          trigger={
            <button type="button" className="flex w-full flex-col items-center pb-1 text-ink-muted">
              <span className="inline-flex h-11 w-11 items-center justify-center">
                <Plus className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-medium">Add</span>
            </button>
          }
        >
          {quickAddItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3.5 py-2.5 text-sm text-ink hover:bg-ivory"
            >
              {item.label}
            </Link>
          ))}
        </PopoverMenu>
      </div>
    </nav>
  );
}

function DockLink(props: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  const Icon = props.icon;
  return (
    <Link
      href={props.href}
      className={cn(
        "flex min-h-11 flex-col items-center justify-center pb-1 text-[10px] font-medium",
        props.active ? "text-ink" : "text-ink-subtle"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="mt-1">{props.label}</span>
    </Link>
  );
}
