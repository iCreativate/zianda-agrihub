"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DashboardPreview } from "@/components/marketing/product-previews";
import { CtaButton } from "@/components/marketing/cta-button";
import { useReducedMotion } from "@/components/marketing/use-reduced-motion";

export function HomeHero() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(reduced);
  const previewRef = useRef<HTMLDivElement>(null);

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
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (event.clientX - cx) / rect.width;
      const dy = (event.clientY - cy) / rect.height;
      node.style.transform = `translate3d(${dx * 6}px, ${dy * 4}px, 0)`;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-ink lg:min-h-[90vh]">
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 ${mounted ? "home-hero-bg-visible" : "home-hero-bg"}`}
        >
          <Image
            src="/images/home/hero.jpg"
            alt="AI-generated savanna sunset with cattle"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/45 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/25" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] w-full max-w-[1200px] flex-col justify-center px-5 pb-24 pt-28 md:px-8 lg:min-h-[90vh] lg:pb-16 lg:pt-32">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-12">
          <div className="max-w-xl lg:max-w-none">
            <p
              className={`home-enter text-[11px] font-semibold uppercase tracking-eyebrow text-wheat ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "80ms" }}
            >
              Built for African agriculture
            </p>
            <h1
              className={`home-enter mt-5 text-4xl font-semibold leading-[1.04] tracking-tight text-paper sm:text-5xl lg:text-[3.35rem] ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "160ms" }}
            >
              The digital farming
              <br />
              platform built for Africa.
            </h1>
            <p
              className={`home-enter mt-5 max-w-md text-base leading-relaxed text-paper/80 sm:text-lg ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "240ms" }}
            >
              Manage livestock, crops, finances and farm operations from one intelligent hub.
            </p>
            <div
              className={`home-enter mt-8 flex flex-wrap gap-3 ${mounted ? "home-enter-visible" : ""}`}
              style={{ transitionDelay: "320ms" }}
            >
              <CtaButton href="/register" variant="light">
                Start Managing Your Farm
              </CtaButton>
              <CtaButton href="#platform" variant="secondary">
                Explore the Platform
              </CtaButton>
            </div>
          </div>

          <div
            className={`home-enter relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg lg:justify-self-end ${mounted ? "home-enter-visible" : ""}`}
            style={{ transitionDelay: "420ms" }}
          >
            <div
              ref={previewRef}
              className={`home-preview-float transition-transform duration-300 will-change-transform ${!reduced ? "home-preview-animate" : ""}`}
            >
              <div className="rounded-card border border-paper/20 bg-paper/10 p-1 shadow-lift backdrop-blur-md">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
