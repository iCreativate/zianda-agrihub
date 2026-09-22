"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CloudSun, Plus, QrCode, Wifi, WifiOff } from "lucide-react";
import { DashboardPreview } from "@/components/marketing/product-previews";
import { useReducedMotion } from "@/components/marketing/use-reduced-motion";
import { platformImage } from "@/lib/images/platform-images";
import { formatRelativeTime } from "@/lib/format";

export function DashboardHero(props: {
  farmName: string;
  location: string;
  weatherLabel: string | null;
  online: boolean;
  lastSync: number;
}) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(reduced);
  const previewRef = useRef<HTMLDivElement>(null);
  const aerial = platformImage("aerial");

  useEffect(() => {
    if (!reduced) setMounted(true);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const node = previewRef.current;
    if (!node) return;

    function onMove(event: MouseEvent) {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      node.style.transform = `translate3d(${dx * 5}px, ${dy * 3}px, 0)`;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${mounted ? "home-hero-bg-visible" : "home-hero-bg"}`}>
          <Image
            src={aerial.src}
            alt={aerial.alt}
            fill
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/82 via-ink/55 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
      </div>

      <div className="relative px-5 py-8 md:px-8 md:py-10 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-10">
          <div>
            <p
              className={`home-enter text-[11px] font-semibold uppercase tracking-eyebrow text-wheat ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "60ms" }}
            >
              Command centre
            </p>
            <h1
              className={`home-enter mt-3 text-3xl font-semibold leading-tight tracking-tight text-paper sm:text-4xl lg:text-[2.75rem] ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "120ms" }}
            >
              {props.farmName}
            </h1>
            <p
              className={`home-enter mt-2 text-base text-paper/75 ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "180ms" }}
            >
              {props.location}
            </p>

            <div
              className={`home-enter mt-5 flex flex-wrap items-center gap-3 text-sm ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "240ms" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/10 px-3 py-1.5 text-paper backdrop-blur-sm">
                <CloudSun className="h-4 w-4 text-wheat" />
                {props.weatherLabel ?? "Weather loading"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/10 px-3 py-1.5 text-paper/90 backdrop-blur-sm">
                {props.online ? (
                  <>
                    <Wifi className="h-4 w-4 text-crop-soft" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-clay-soft" />
                    Offline
                  </>
                )}
              </span>
              <span className="text-paper/60">
                Synced {formatRelativeTime(props.lastSync || undefined)}
              </span>
            </div>

            <div
              className={`home-enter mt-7 flex flex-wrap gap-2 ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "300ms" }}
            >
              <Link
                href="/scan"
                className="home-cta group inline-flex min-h-11 items-center gap-2 rounded-control bg-paper px-5 py-2.5 text-sm font-semibold text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-ivory hover:shadow-lift"
              >
                <QrCode className="h-4 w-4" />
                Scan animal
              </Link>
              <Link
                href="/livestock/new"
                className="inline-flex min-h-11 items-center gap-2 rounded-control border border-paper/30 bg-paper/10 px-5 py-2.5 text-sm font-semibold text-paper backdrop-blur-sm transition hover:border-paper/50 hover:bg-paper/15"
              >
                <Plus className="h-4 w-4" />
                Add animal
              </Link>
              <Link
                href="/vegetation/new"
                className="inline-flex min-h-11 items-center gap-2 rounded-control border border-paper/30 bg-paper/10 px-5 py-2.5 text-sm font-semibold text-paper backdrop-blur-sm transition hover:border-paper/50 hover:bg-paper/15"
              >
                <Plus className="h-4 w-4" />
                Add field
              </Link>
            </div>
          </div>

          <div
            className={`home-enter relative mx-auto w-full max-w-md lg:max-w-none lg:justify-self-end ${mounted ? "home-enter-visible" : ""}`}
            style={{ transitionDelay: "380ms" }}
          >
            <div
              ref={previewRef}
              className={`transition-transform duration-300 will-change-transform ${!reduced ? "home-preview-animate" : ""}`}
            >
              <div className="rounded-card border border-paper/20 bg-paper/10 p-1.5 shadow-lift backdrop-blur-md">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
