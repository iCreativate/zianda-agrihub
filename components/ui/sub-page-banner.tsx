"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/components/marketing/use-reduced-motion";
import { cn } from "@/lib/utils";

type SubPageBannerProps = {
  backHref: string;
  backLabel: string;
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  actions?: React.ReactNode;
  className?: string;
};

/**
 * Compact cinematic header for forms, detail pages, and edit flows.
 */
export function SubPageBanner(props: SubPageBannerProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(reduced);

  useEffect(() => {
    if (!reduced) setMounted(true);
  }, [reduced]);

  return (
    <section className={cn("relative overflow-hidden bg-ink", props.className)}>
      {props.image ? (
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 ${mounted ? "home-hero-bg-visible" : "home-hero-bg"}`}
          >
            <Image
              src={props.image}
              alt={props.imageAlt ?? ""}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover opacity-50"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/72 to-ink/55" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-crop/30" />
      )}

      <div className="relative px-5 py-6 md:px-8 md:py-8">
        <Link
          href={props.backHref}
          className={`home-enter inline-flex items-center gap-1.5 text-sm font-medium text-paper/70 transition hover:text-paper ${mounted ? "home-enter-visible" : ""}`}
        >
          <ChevronLeft className="h-4 w-4" />
          {props.backLabel}
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {props.eyebrow && (
              <p
                className={`home-enter text-[11px] font-semibold uppercase tracking-eyebrow text-wheat ${mounted ? "home-enter-visible" : ""}`}
                style={{ transitionDelay: "80ms" }}
              >
                {props.eyebrow}
              </p>
            )}
            <h1
              className={`home-enter mt-2 text-2xl font-semibold tracking-tight text-paper md:text-3xl ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "140ms" }}
            >
              {props.title}
            </h1>
            {props.description && (
              <p
                className={`home-enter mt-2 max-w-lg text-sm text-paper/70 ${mounted ? "home-enter-visible" : ""}`}
                style={{ transitionDelay: "200ms" }}
              >
                {props.description}
              </p>
            )}
          </div>
          {props.actions && (
            <div
              className={`home-enter flex flex-wrap gap-2 ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "240ms" }}
            >
              {props.actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
