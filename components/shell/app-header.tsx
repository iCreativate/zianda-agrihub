"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  CloudSun,
  Plus,
  UserRound
} from "lucide-react";
import { PopoverMenu } from "@/components/ui/popover-menu";
import { MobileShellNav } from "@/components/ui/MobileShellNav";
import { useFarm } from "@/lib/farm/use-farm";
import { useOnline } from "@/lib/farm/use-online";
import { useWeather } from "@/lib/farm/use-weather";
import { useVaccinationSchedule } from "@/lib/supabase/hooks";
import { quickAddItems } from "@/components/shell/nav";

export function AppHeader() {
  const { farm, farms, selectFarm } = useFarm();
  const online = useOnline();
  const weather = useWeather(farm.lat, farm.lon);
  const { data: upcoming = [] } = useVaccinationSchedule(30, 0);
  const dueSoon = upcoming.filter((item) => !item.completed).slice(0, 5);

  return (
    <header className="sticky top-0 z-30 border-b border-stone bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="flex min-h-16 items-center gap-2 px-3 md:px-5">
        <MobileShellNav />

        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink md:hidden">
          {farm.name}
        </p>

        <div className="hidden md:block md:w-2" aria-hidden />

        <PopoverMenu
          align="left"
          className="hidden md:inline-flex"
          trigger={
            <button
              type="button"
              className="inline-flex min-h-11 max-w-[240px] items-center gap-2 rounded-control border border-stone bg-ivory px-3 text-left"
            >
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold text-ink">{farm.name}</span>
                <span className="block truncate text-[11px] text-ink-subtle">{farm.location}</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-ink-subtle" />
            </button>
          }
        >
          {farms.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectFarm(item.id)}
              className="flex w-full flex-col px-3.5 py-2.5 text-left hover:bg-ivory"
            >
              <span className="text-sm font-medium text-ink">{item.name}</span>
              <span className="text-xs text-ink-subtle">{item.location}</span>
            </button>
          ))}
          <Link href="/settings" className="block border-t border-stone px-3.5 py-2.5 text-sm text-ink-muted hover:bg-ivory hover:text-ink">
            Manage farms
          </Link>
        </PopoverMenu>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div
            className="inline-flex min-h-11 items-center gap-2 rounded-control px-2.5 text-xs text-ink-muted"
            title={online ? "Online" : "Offline"}
          >
            <span className={`h-2 w-2 rounded-full ${online ? "bg-crop" : "bg-clay"}`} />
            <span className="hidden sm:inline">{online ? "Online" : "Offline"}</span>
            <span className="tabular-nums text-ink lg:hidden">
              {weather.data ? `${Math.round(weather.data.temperature)}°` : ""}
            </span>
          </div>

          <div className="hidden min-h-11 items-center gap-2 rounded-control border border-stone bg-ivory px-3 lg:flex">
            <CloudSun className="h-4 w-4 text-sky" />
            <span className="text-[13px] font-medium tabular-nums text-ink">
              {weather.data ? `${Math.round(weather.data.temperature)}°` : "—"}
            </span>
            <span className="text-[12px] text-ink-subtle">{weather.data?.label ?? "Weather"}</span>
          </div>

          <PopoverMenu
            trigger={
              <button
                type="button"
                className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-stone bg-paper text-ink hover:bg-ivory"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {dueSoon.length > 0 && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-clay" />
                )}
              </button>
            }
          >
            <p className="px-3.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
              Health alerts
            </p>
            {dueSoon.length === 0 ? (
              <p className="px-3.5 py-3 text-sm text-ink-muted">No upcoming health tasks.</p>
            ) : (
              dueSoon.map((item) => (
                <Link
                  key={item.id}
                  href="/vaccinations"
                  className="block px-3.5 py-2.5 hover:bg-ivory"
                >
                  <span className="block text-sm font-medium text-ink">{item.vaccineName}</span>
                  <span className="block text-xs text-ink-subtle">{item.scheduledDate}</span>
                </Link>
              ))
            )}
          </PopoverMenu>

          <PopoverMenu
            trigger={
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control bg-ink text-paper hover:bg-ink/90"
                aria-label="Quick add"
              >
                <Plus className="h-4 w-4" />
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

          <PopoverMenu
            trigger={
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-control border border-stone bg-paper text-ink hover:bg-ivory"
                aria-label="Account"
              >
                <UserRound className="h-4 w-4" />
              </button>
            }
          >
            <div className="px-3.5 py-2.5">
              <p className="text-sm font-medium text-ink">{farm.name}</p>
              <p className="text-xs text-ink-subtle">{farm.location}</p>
            </div>
            <Link href="/settings" className="block px-3.5 py-2.5 text-sm text-ink hover:bg-ivory">
              Farm settings
            </Link>
            <Link href="/" className="block px-3.5 py-2.5 text-sm text-ink-muted hover:bg-ivory hover:text-ink">
              Back to home
            </Link>
          </PopoverMenu>
        </div>
      </div>
    </header>
  );
}
