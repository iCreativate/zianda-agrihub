"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/components/marketing/use-reduced-motion";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  asideTitle?: string;
  asideNote?: string;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
  compact?: boolean;
};

/**
 * Cinematic page hero matching the landing page and dashboard command centre.
 */
export function PageHero(props: PageHeroProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(reduced);
  const hasAside = Boolean(
    props.aside || props.actions || props.asideTitle || props.asideNote
  );

  useEffect(() => {
    if (!reduced) setMounted(true);
  }, [reduced]);

  return (
    <section className={cn("relative overflow-hidden bg-ink", props.className)}>
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${mounted ? "home-hero-bg-visible" : "home-hero-bg"}`}
        >
          <Image
            src={props.image}
            alt={props.imageAlt}
            fill
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/82 via-ink/55 to-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/20" />
      </div>

      <div
        className={cn(
          "relative px-5 md:px-8",
          props.compact ? "py-7 md:py-8" : "py-8 md:py-10 lg:py-12"
        )}
      >
        <div
          className={cn(
            "grid items-end gap-8",
            hasAside && "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10"
          )}
        >
          <div className="max-w-xl lg:max-w-none">
            <p
              className={`home-enter text-[11px] font-semibold uppercase tracking-eyebrow text-wheat ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "60ms" }}
            >
              {props.eyebrow}
            </p>
            <h1
              className={`home-enter mt-3 text-3xl font-semibold leading-tight tracking-tight text-paper sm:text-4xl ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "120ms" }}
            >
              {props.title}
            </h1>
            <p
              className={`home-enter mt-2 max-w-md text-sm leading-relaxed text-paper/75 md:text-base ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "180ms" }}
            >
              {props.description}
            </p>
          </div>

          {hasAside && (
            <div
              className={`home-enter page-hero-aside rounded-card border border-paper/15 bg-paper/10 p-5 backdrop-blur-md md:p-6 ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "260ms" }}
            >
              {props.aside ?? (
                <div className="flex h-full flex-col justify-between gap-5">
                  {(props.asideTitle || props.asideNote) && (
                    <div>
                      {props.asideTitle && (
                        <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/55">
                          {props.asideTitle}
                        </p>
                      )}
                      {props.asideNote && (
                        <p className="mt-2 text-sm leading-relaxed text-paper/75">
                          {props.asideNote}
                        </p>
                      )}
                    </div>
                  )}
                  {props.actions && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {props.actions}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
