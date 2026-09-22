"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";
import { useFarm } from "@/lib/farm/use-farm";
import { AVAILABLE_FARMS } from "@/lib/farm/profile";
import { useWeather } from "@/lib/farm/use-weather";
import {
  useDashboardMetrics,
  useLivestockList,
  useMarketplaceListings,
  useVegetationList
} from "@/lib/supabase/hooks";
import { formatMoney, formatNumber } from "@/lib/format";
import { formatHectares } from "@/lib/crops/stages";
import { BookOpen, Leaf, Store, Users, CloudSun } from "lucide-react";

export default function SettingsPage() {
  const { farm, updateFarm, selectFarm } = useFarm();
  const weather = useWeather(farm.lat, farm.lon);
  const metrics = useDashboardMetrics();
  const livestock = useLivestockList();
  const crops = useVegetationList();
  const listings = useMarketplaceListings();
  const [name, setName] = useState(farm.name);
  const [location, setLocation] = useState(farm.location);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(farm.name);
    setLocation(farm.location);
  }, [farm.id, farm.name, farm.location]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    updateFarm({ name: name.trim() || farm.name, location: location.trim() || farm.location });
    setSaved(true);
  }

  return (
    <AppPage
      hero={
        <PageHero
        eyebrow="Farm"
        title="Farm settings"
        description="Name this operation, set its location for weather, and review the workspace snapshot."
        image="/images/home/aerial.jpg"
        imageAlt="Aerial view of the farm"
        asideTitle="Workspace"
        asideNote="These details drive weather, reports, and how the farm is named across the hub."
        actions={
        <Link href="/education" className="btn-secondary min-h-12">
        <BookOpen className="h-4 w-4" />
        Education guides
        </Link>
        }
        />
      }
    >

      <section className="grid gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Livestock"
          value={livestock.isLoading ? "—" : formatNumber(livestock.data?.length ?? 0)}
        />
        <Metric
          label="Crop blocks"
          value={crops.isLoading ? "—" : formatNumber(crops.data?.length ?? 0)}
        />
        <Metric
          label="Area"
          value={
            crops.isLoading
              ? "—"
              : formatHectares(
                  (crops.data ?? []).reduce((sum, block) => sum + (block.areaHectares || 0), 0)
                )
          }
        />
        <Metric
          label="Listings"
          value={listings.isLoading ? "—" : formatNumber(listings.data?.length ?? 0)}
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <form onSubmit={onSubmit} className="surface space-y-5 p-6">
          <div>
            <label className="label-field" htmlFor="farm-select">
              Active farm
            </label>
            <select
              id="farm-select"
              className="input-field mt-1.5"
              value={farm.id}
              onChange={(event) => {
                selectFarm(event.target.value);
                const next = AVAILABLE_FARMS.find((item) => item.id === event.target.value);
                if (next) {
                  setName(next.name);
                  setLocation(next.location);
                  setSaved(false);
                }
              }}
            >
              {AVAILABLE_FARMS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field" htmlFor="farm-name">
              Display name
            </label>
            <input
              id="farm-name"
              className="input-field mt-1.5"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaved(false);
              }}
            />
          </div>
          <div>
            <label className="label-field" htmlFor="farm-location">
              Location
            </label>
            <input
              id="farm-location"
              className="input-field mt-1.5"
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setSaved(false);
              }}
            />
            <p className="help-text">
              Used for the weather readout. Livestock and crop records stay on this workspace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary">
              Save farm
            </button>
            {saved && <p className="text-sm text-crop">Saved.</p>}
          </div>
        </form>

        <div className="space-y-5">
          <div className="surface p-5">
            <p className="section-eyebrow">Local weather</p>
            <div className="mt-3 flex items-center gap-3">
              <CloudSun className="h-5 w-5 text-sky" />
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {weather.data ? `${Math.round(weather.data.temperature)}°` : "—"}
                </p>
                <p className="text-sm text-ink-muted">{weather.data?.label ?? "Weather unavailable"}</p>
              </div>
            </div>
            {weather.data && (
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-control bg-ivory px-2.5 py-2">
                  <dt className="text-ink-subtle">Humidity</dt>
                  <dd className="font-medium">{Math.round(weather.data.humidity)}%</dd>
                </div>
                <div className="rounded-control bg-ivory px-2.5 py-2">
                  <dt className="text-ink-subtle">Wind</dt>
                  <dd className="font-medium">{Math.round(weather.data.wind)} km/h</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="surface p-5">
            <p className="section-eyebrow">Workspace</p>
            <div className="mt-3 space-y-2 text-sm">
              <Row
                label="Monthly burn"
                value={formatMoney(metrics.data?.monthlyBurn ?? 0)}
              />
              <Row
                label="Yield forecast"
                value={formatMoney(metrics.data?.projectedYield ?? 0)}
              />
              <Row
                label="Health tasks"
                value={formatNumber(metrics.data?.upcomingVaccinations ?? 0)}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="section-eyebrow mb-4">Also in Zianda</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Related href="/marketplace" icon={Store} title="Marketplace" note="Buy and sell livestock, produce, and inputs." />
          <Related href="/seeds" icon={Leaf} title="Seeds" note="Varieties and batches." />
          <Related href="/farmer-hub" icon={Users} title="Farmer hub" note="Notes and shared field knowledge." />
          <Related href="/education" icon={BookOpen} title="Education" note="Guides and seasonal learning." />
        </div>
      </div>
    </AppPage>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="bg-paper px-4 py-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">{props.label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{props.value}</p>
    </div>
  );
}

function Row(props: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2.5">
      <span className="text-ink-muted">{props.label}</span>
      <span className="font-semibold tabular-nums text-ink">{props.value}</span>
    </div>
  );
}

function Related(props: {
  href: string;
  icon: typeof Store;
  title: string;
  note: string;
}) {
  const Icon = props.icon;
  return (
    <Link href={props.href} className="surface-interactive p-5">
      <Icon className="h-5 w-5 text-ink-subtle" />
      <p className="mt-3 font-medium">{props.title}</p>
      <p className="mt-0.5 text-sm text-ink-muted">{props.note}</p>
    </Link>
  );
}
