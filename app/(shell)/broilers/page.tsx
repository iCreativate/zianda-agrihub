"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { BroilerGuide } from "@/components/broilers/broiler-guide";
import { AppPage } from "@/components/shell/app-page";
import { PageHero } from "@/components/ui/page-hero";
import { platformImage } from "@/lib/images/platform-images";
import {
  broilerSections,
  type BroilerSectionId
} from "@/lib/broilers/manual";

function isSectionId(value: string | null): value is BroilerSectionId {
  return Boolean(value && broilerSections.some((item) => item.id === value));
}

function BroilerPageBody() {
  const params = useSearchParams();
  const sectionParam = params.get("section");
  const initialSection = isSectionId(sectionParam) ? sectionParam : "overview";
  const hero = platformImage("livestock");

  return (
    <AppPage
      hero={
        <PageHero
          eyebrow="Poultry · AFGRI guide"
          title="Broiler management"
          description="Feeds, housing, brooding, litter, lighting, ventilation, biosecurity, records, and performance targets from the AFGRI broiler manual."
          image={hero.src}
          imageAlt={hero.alt}
          asideTitle="Use with your TA"
          asideNote="Site climate, density, and disease pressure change targets. Confirm vaccination programmes with a poultry veterinarian."
          actions={
            <Link href="/dashboard" className="btn-hero-secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to overview
            </Link>
          }
        />
      }
    >
      <BroilerGuide initialSection={initialSection} />
      <p className="text-xs leading-relaxed text-ink-subtle">
        Source: AFGRI Animal Feeds — Poultry Product &amp; Basic Broiler Management Manual
        (2021). Nutrient values are registration specs; live-weight guidelines may vary ±20%.
      </p>
    </AppPage>
  );
}

export default function BroilersPage() {
  return (
    <Suspense
      fallback={
        <div className="command-centre px-1 py-10">
          <div className="mx-auto max-w-[1200px] space-y-4">
            <div className="h-40 animate-pulse rounded-card bg-stone/40" />
            <div className="h-64 animate-pulse rounded-card bg-stone/30" />
          </div>
        </div>
      }
    >
      <BroilerPageBody />
    </Suspense>
  );
}
