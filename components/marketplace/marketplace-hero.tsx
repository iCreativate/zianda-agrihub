"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useReducedMotion } from "@/components/marketing/use-reduced-motion";
import { platformImage } from "@/lib/images/platform-images";

export function MarketplaceHero(props: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(reduced);
  const grain = platformImage("grain");

  useEffect(() => {
    if (!reduced) setMounted(true);
  }, [reduced]);

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${mounted ? "home-hero-bg-visible" : "home-hero-bg"}`}
        >
          <Image
            src={grain.src}
            alt={grain.alt}
            fill
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/82 via-ink/58 to-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
      </div>

      <div className="relative px-5 py-8 md:px-8 md:py-10 lg:py-12">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-10">
          <div>
            <p
              className={`home-enter text-[11px] font-semibold uppercase tracking-eyebrow text-wheat ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "60ms" }}
            >
              Trade
            </p>
            <h1
              className={`home-enter mt-3 text-3xl font-semibold tracking-tight text-paper sm:text-4xl ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "120ms" }}
            >
              Marketplace
            </h1>
            <p
              className={`home-enter mt-3 max-w-lg text-sm leading-relaxed text-paper/75 md:text-base ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "180ms" }}
            >
              Buy and sell livestock, produce, equipment and agricultural inputs directly
              through the Zianda ecosystem.
            </p>
            <div
              className={`home-enter mt-4 flex flex-wrap gap-2 ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "240ms" }}
            >
              {["Buy", "Sell", "Discover"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-paper/15 bg-paper/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-paper backdrop-blur-sm"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div
            className={`home-enter space-y-3 ${mounted ? "home-enter-visible" : ""}`}
            style={{ transitionDelay: "300ms" }}
          >
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
              <input
                type="search"
                value={props.query}
                onChange={(e) => props.onQueryChange(e.target.value)}
                placeholder="Search livestock, maize, equipment, feed…"
                className="input-field min-h-12 w-full pl-10"
              />
            </label>
            <Link href="/marketplace/new" className="btn-hero-primary w-full justify-center">
              <Plus className="h-4 w-4" />
              Sell something
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
