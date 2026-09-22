"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/ui/brand-mark";
import { CtaButton } from "@/components/marketing/cta-button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#solutions", label: "Solutions" },
  { href: "#marketplace", label: "Marketplace" },
  { href: "#resources", label: "Resources" }
];

export function HomeNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-stone/80 bg-paper/85 py-3 shadow-soft backdrop-blur-md"
          : "bg-transparent py-5"
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 transition-all duration-500 md:px-8",
          scrolled && "max-w-[1180px]"
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 transition",
            scrolled ? "text-ink" : "text-paper"
          )}
        >
          <BrandMark size="sm" />
          <span className="text-sm font-semibold tracking-tight">Zianda Agri-Hub</span>
        </Link>

        <nav
          className={cn(
            "hidden items-center gap-8 text-sm font-medium md:flex",
            scrolled ? "text-ink-muted" : "text-paper/85"
          )}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="home-nav-link transition hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className={cn(
              "hidden min-h-10 items-center px-3 text-sm font-medium transition sm:inline-flex",
              scrolled ? "text-ink-muted hover:text-ink" : "text-paper/85 hover:text-paper"
            )}
          >
            Log in
          </Link>
          <CtaButton
            href="/register"
            variant={scrolled ? "primary" : "light"}
            className="min-h-10 px-4 py-2 text-sm"
          >
            Get started
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
