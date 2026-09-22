"use client";

import Link from "next/link";
import { TrendingUp, GraduationCap, ArrowRight, HeartPulse, Wallet, QrCode, Sprout } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";

const latestTrends = [
  {
    id: "1",
    title: "Climate-smart practices for smallholder farmers",
    excerpt:
      "How to adapt planting dates and crop choices to shifting rainfall patterns and reduce risk.",
    category: "Latest trends",
    slug: "climate-smart-practices",
    tone: "crop" as const
  },
  {
    id: "2",
    title: "Livestock vaccination calendars by region",
    excerpt:
      "Recommended schedules for Brucellosis, Anthrax, and other common vaccines based on local disease pressure.",
    category: "Latest trends",
    slug: "vaccination-calendars",
    tone: "clay" as const
  },
  {
    id: "3",
    title: "Soil health: pH and moisture monitoring",
    excerpt:
      "Simple ways to log and interpret soil data to improve fertilizer and irrigation decisions.",
    category: "Latest trends",
    slug: "soil-health-monitoring",
    tone: "wheat" as const
  }
];

const farmerEducation = [
  {
    id: "4",
    title: "Getting started with farm record-keeping",
    excerpt:
      "Why records matter for loans and markets, and how to keep them without extra hassle.",
    category: "Farmer education",
    slug: "record-keeping-basics",
    tone: "sky" as const
  },
  {
    id: "5",
    title: "Understanding your burn rate and cash flow",
    excerpt:
      "Track costs by month and by enterprise so you know when cash is tight and when to sell.",
    category: "Farmer education",
    slug: "burn-rate-cash-flow",
    tone: "wheat" as const
  },
  {
    id: "6",
    title: "QR codes and traceability for buyers",
    excerpt:
      "How health cards and block IDs help you prove quality and origin to buyers and cooperatives.",
    category: "Farmer education",
    slug: "qr-traceability",
    tone: "crop" as const
  }
];

const practiceLinks = [
  { href: "/vaccinations", label: "Health calendar", icon: HeartPulse },
  { href: "/finances/burn-vs-yield", label: "Burn vs yield", icon: Wallet },
  { href: "/scan", label: "QR scanner", icon: QrCode },
  { href: "/vegetation", label: "Crop fields", icon: Sprout }
];

export default function EducationPage() {
  return (
    <AppPage
      hero={
        <PageHero
        eyebrow="Learn"
        title="Education"
        description="Latest trends and practical guides to help you run your farm better."
        image="/images/home/farmer.jpg"
        imageAlt="Farmer learning in the field"
        asideTitle="Guides"
        asideNote="Short reads on climate, health, cash flow, and traceability."
        />
      }
    >

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Field intel</p>
            <div className="mt-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ink-subtle" />
              <h2 className="text-xl font-semibold tracking-tight text-ink">Latest trends</h2>
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              What’s shifting in climate, animal health, and soil decisions.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {latestTrends.map((item, index) => (
            <ArticleCard key={item.id} item={item} index={index + 1} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="section-eyebrow">Practical guides</p>
          <div className="mt-2 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-ink-subtle" />
            <h2 className="text-xl font-semibold tracking-tight text-ink">Farmer education</h2>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Record-keeping, cash flow, and traceability you can use this week.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {farmerEducation.map((item, index) => (
            <ArticleCard key={item.id} item={item} index={index + 1} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-card border border-stone bg-paper shadow-soft">
        <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="border-b border-stone p-5 md:p-7 lg:border-b-0 lg:border-r">
            <p className="section-eyebrow">Next step</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">
              Put learning to work
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
              Jump from these guides into the live records that make them useful on the farm —
              health dates, spend, fields, and tags.
            </p>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-1 lg:p-5">
            {practiceLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-12 items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2.5 transition hover:border-stone-strong hover:bg-paper"
                >
                  <span className="inline-flex items-center gap-2.5 text-sm font-medium text-ink">
                    <span className="flex h-8 w-8 items-center justify-center rounded-control bg-paper text-ink-subtle">
                      <Icon className="h-4 w-4" />
                    </span>
                    {item.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-ink-subtle transition group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </AppPage>
  );
}

function ArticleCard(props: {
  item: {
    title: string;
    excerpt: string;
    category: string;
    slug: string;
    tone: "crop" | "clay" | "wheat" | "sky";
  };
  index: number;
}) {
  const { item, index } = props;
  const soft =
    item.tone === "crop"
      ? "bg-crop-soft text-crop"
      : item.tone === "clay"
        ? "bg-clay-soft text-clay"
        : item.tone === "wheat"
          ? "bg-wheat-soft text-ink"
          : "bg-sky-soft text-sky";

  return (
    <Link
      href={`/education/${item.slug}`}
      className="group flex h-full flex-col rounded-card border border-stone bg-paper p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-stone-strong hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex rounded-control px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${soft}`}
        >
          {item.category}
        </span>
        <span className="font-mono text-xs tabular-nums text-ink-subtle">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink group-hover:text-ink">
        {item.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{item.excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        Read guide
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
