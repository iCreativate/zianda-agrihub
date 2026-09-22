"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/brand-mark";
import {
  moreNav,
  primaryNav,
  isNavActive,
  isMoreNavActive,
  type NavItem
} from "@/components/shell/nav";

function NavLink(props: { item: NavItem; pathname: string; onNavigate?: () => void }) {
  const active = isNavActive(props.pathname, props.item);
  const Icon = props.item.icon;

  return (
    <Link
      href={props.item.href}
      onClick={props.onNavigate}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-medium transition",
        active
          ? "bg-ink text-paper"
          : "text-ink-muted hover:bg-ivory hover:text-ink"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", active ? "text-paper" : "text-ink-subtle")}
      />
      <span className="truncate">{props.item.label}</span>
    </Link>
  );
}

export function Sidebar(props: { onNavigate?: () => void; variant?: "desktop" | "drawer" }) {
  const pathname = usePathname();
  const moreActive = isMoreNavActive(pathname);

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col bg-paper",
        props.variant === "drawer" ? "min-h-full" : "h-full"
      )}
    >
      {props.variant !== "drawer" && (
        <div className="border-b border-stone px-4 py-4">
          <Link
            href="/dashboard"
            onClick={props.onNavigate}
            className="flex min-h-11 items-center gap-3"
          >
            <BrandMark size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-ink">
                Zianda Agri-Hub
              </p>
              <p className="truncate text-xs text-ink-subtle">Operations</p>
            </div>
          </Link>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="section-eyebrow mb-2 px-3">Navigate</p>
        {primaryNav.map((item) => (
          <NavLink
            key={`${item.label}-${item.href}`}
            item={item}
            pathname={pathname}
            onNavigate={props.onNavigate}
          />
        ))}

        <details className="group mt-5" open={moreActive ? true : undefined}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-control px-3 text-sm font-medium text-ink-subtle transition hover:bg-ivory hover:text-ink">
            More
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </summary>
          <div className="mt-1 space-y-0.5">
            {moreNav.map((item) => (
              <NavLink
                key={`${item.label}-${item.href}`}
                item={item}
                pathname={pathname}
                onNavigate={props.onNavigate}
              />
            ))}
          </div>
        </details>
      </nav>
    </aside>
  );
}
