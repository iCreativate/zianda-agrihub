"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CtaButton(props: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light" | "dark";
  className?: string;
}) {
  const variant = props.variant ?? "primary";

  const styles = {
    primary:
      "bg-ink text-paper shadow-soft hover:bg-ink/90 hover:-translate-y-0.5 hover:shadow-lift",
    secondary:
      "border border-paper/35 bg-paper/10 text-paper backdrop-blur-sm hover:border-paper/60 hover:bg-paper/15",
    light:
      "bg-paper text-ink shadow-soft hover:bg-ivory hover:-translate-y-0.5 hover:shadow-lift",
    dark:
      "border border-paper/20 bg-paper/10 text-paper hover:bg-paper/15 hover:-translate-y-0.5"
  }[variant];

  return (
    <Link
      href={props.href}
      className={cn(
        "home-cta group inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-6 py-3 text-sm font-semibold transition duration-300",
        styles,
        props.className
      )}
    >
      <span>{props.children}</span>
      <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function TextLink(props: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={props.href}
      className={cn(
        "home-text-link group inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition hover:text-crop",
        props.className
      )}
    >
      {props.children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
    </Link>
  );
}
