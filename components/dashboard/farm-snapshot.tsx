"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { MapPin, PawPrint, Sprout, Tractor, X } from "lucide-react";
import { platformImage } from "@/lib/images/platform-images";
import type { Livestock, VegetationBlock } from "@/types/agriculture";

type SnapshotMarker = {
  id: string;
  kind: "field" | "livestock" | "equipment";
  label: string;
  detail: string;
  top: number;
  left: number;
  href: string;
};

function markerPosition(id: string, index: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 997;
  }
  return {
    top: 18 + (hash % 52),
    left: 12 + ((hash * 11 + index * 17) % 68)
  };
}

function buildMarkers(livestock: Livestock[], crops: VegetationBlock[]): SnapshotMarker[] {
  const markers: SnapshotMarker[] = crops.slice(0, 6).map((block, index) => {
    const pos = markerPosition(block.id, index);
    return {
      id: block.id,
      kind: "field" as const,
      label: block.externalId,
      detail: `${block.cropType}${block.areaHectares ? ` · ${block.areaHectares} ha` : ""}`,
      ...pos,
      href: `/vegetation/${block.id}`
    };
  });

  if (livestock.length > 0) {
    markers.push({
      id: "livestock-paddock",
      kind: "livestock",
      label: "Livestock areas",
      detail: `${livestock.length} animal${livestock.length === 1 ? "" : "s"} on record`,
      ...markerPosition("livestock-paddock", 0),
      href: "/livestock"
    });
  }

  markers.push({
    id: "equipment-yard",
    kind: "equipment",
    label: "Equipment yard",
    detail: "Tractors, tools & plant",
    top: 68,
    left: 76,
    href: "/equipment"
  });

  return markers;
}

const MARKER_ICON = {
  field: Sprout,
  livestock: PawPrint,
  equipment: Tractor
} as const;

export function FarmSnapshot(props: {
  farmName: string;
  livestock: Livestock[];
  crops: VegetationBlock[];
}) {
  const aerial = platformImage("aerial");
  const markers = useMemo(
    () => buildMarkers(props.livestock, props.crops),
    [props.livestock, props.crops]
  );
  const [active, setActive] = useState<SnapshotMarker | null>(null);

  return (
    <section className="home-stage-card relative overflow-hidden rounded-card bg-ink shadow-lift">
      <div className="relative min-h-[300px] md:min-h-[380px] lg:min-h-[440px]">
        <Image
          src={aerial.src}
          alt={aerial.alt}
          fill
          sizes="(min-width: 1280px) 800px, 100vw"
          className="object-cover opacity-95 transition duration-700 hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/30" />

        <div className="relative flex h-full min-h-[300px] flex-col justify-between p-5 md:min-h-[380px] md:p-6 lg:min-h-[440px]">
          <div>
            <p className="section-eyebrow text-wheat/80">Farm snapshot</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-paper md:text-3xl">
              Your farm.
              <br />
              One intelligent view.
            </h2>
            <p className="mt-2 max-w-md text-sm text-paper/70">
              Tap a marker to open fields, livestock, or equipment.
            </p>
          </div>

          <div className="absolute inset-0">
            {markers.map((marker) => {
              const Icon = MARKER_ICON[marker.kind];
              const selected = active?.id === marker.id;
              return (
                <button
                  key={marker.id}
                  type="button"
                  aria-label={marker.label}
                  aria-pressed={selected}
                  onClick={() => setActive(selected ? null : marker)}
                  className="home-field-marker group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${marker.top}%`, left: `${marker.left}%` }}
                >
                  <span
                    className={`home-field-pulse flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lift transition ${
                      selected
                        ? "scale-110 border-paper bg-paper text-ink"
                        : "border-paper/80 bg-ink/50 text-paper backdrop-blur-sm group-hover:scale-105 group-hover:border-paper group-hover:bg-paper group-hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative mt-auto flex flex-wrap gap-4 text-xs text-paper/80">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/15 bg-paper/10 px-3 py-1 backdrop-blur-sm">
              <Sprout className="h-3.5 w-3.5" />
              {props.crops.length} field{props.crops.length === 1 ? "" : "s"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/15 bg-paper/10 px-3 py-1 backdrop-blur-sm">
              <PawPrint className="h-3.5 w-3.5" />
              {props.livestock.length} head
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-paper/15 bg-paper/10 px-3 py-1 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" />
              {props.farmName}
            </span>
          </div>
        </div>
      </div>

      {active && (
        <div className="border-t border-paper/10 bg-ink/95 px-5 py-4 backdrop-blur-md md:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/50">
                {active.kind}
              </p>
              <p className="mt-1 text-base font-semibold text-paper">{active.label}</p>
              <p className="mt-1 text-sm text-paper/70">{active.detail}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={active.href}
                className="inline-flex min-h-10 items-center rounded-control bg-paper px-4 text-sm font-semibold text-ink transition hover:bg-ivory"
              >
                Open
              </Link>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-paper/20 text-paper/70 transition hover:bg-paper/10 hover:text-paper"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
