"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CircleDollarSign,
  HeartPulse,
  LineChart,
  PawPrint,
  QrCode,
  Sprout,
  Store,
  Wheat
} from "lucide-react";
import { CtaButton, TextLink } from "@/components/marketing/cta-button";
import { ScrollReveal, useInView } from "@/components/marketing/scroll-reveal";
import { useReducedMotion } from "@/components/marketing/use-reduced-motion";

const TRUST_ITEMS = [
  { icon: PawPrint, label: "Livestock" },
  { icon: Sprout, label: "Crops" },
  { icon: HeartPulse, label: "Health" },
  { icon: CircleDollarSign, label: "Finance" },
  { icon: Store, label: "Marketplace" },
  { icon: LineChart, label: "Insights" }
];

const FARM_STAGES = [
  { label: "Plant", image: "/images/home/crops.jpg" },
  { label: "Grow", image: "/images/home/vegetables.jpg" },
  { label: "Monitor", image: "/images/home/aerial.jpg" },
  { label: "Harvest", image: "/images/home/grain.jpg" },
  { label: "Sell", image: "/images/home/livestock.jpg" }
];

const MARKET_LISTINGS = [
  {
    title: "Bonsmara Cattle",
    category: "Livestock",
    location: "Free State",
    price: "R85,000",
    image: "/images/home/livestock.jpg"
  },
  {
    title: "Maize — Grade 1",
    category: "Produce",
    location: "Mpumalanga",
    price: "R4,800 / ton",
    image: "/images/home/grain.jpg"
  },
  {
    title: "Agricultural Equipment",
    category: "Equipment",
    location: "KZN",
    price: "R120,000",
    image: "/images/home/machinery.jpg"
  },
  {
    title: "Fresh Produce",
    category: "Produce",
    location: "Gauteng",
    price: "R2,400",
    image: "/images/home/vegetables.jpg"
  }
];

const INSIGHTS = [
  { label: "Herd health", value: 8.4, suffix: "%", positive: true },
  { label: "Crop performance", value: 12.2, suffix: "%", positive: true },
  { label: "Operating costs", value: 4.8, suffix: "%", positive: false },
  { label: "Yield forecast", value: 9.1, suffix: "%", positive: true }
];

export function TrustStrip() {
  return (
    <section className="border-y border-stone bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
          One platform for the entire farm
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 md:gap-6">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="home-trust-item group flex min-w-[88px] flex-col items-center gap-2 rounded-control px-3 py-2 transition"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory-deep text-ink-muted transition group-hover:-translate-y-0.5 group-hover:bg-crop-soft group-hover:text-crop">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium text-ink-muted group-hover:text-ink">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FarmOneViewSection() {
  const indicators = [
    { label: "428 Livestock", top: "18%", left: "12%" },
    { label: "84 ha", top: "28%", left: "68%" },
    { label: "22°C", top: "52%", left: "22%" },
    { label: "7 Tasks", top: "62%", left: "58%" },
    { label: "R84,200", top: "72%", left: "38%" }
  ];

  return (
    <section id="platform" className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <ScrollReveal className="max-w-2xl">
          <p className="section-eyebrow">Command centre</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Your farm.
            <br />
            One intelligent view.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-muted">
            See livestock, crops, health, finances and operations in one place.
          </p>
        </ScrollReveal>

        <ScrollReveal className="relative mt-12 min-h-[420px] overflow-hidden rounded-card md:min-h-[520px]" delay={120}>
          <Image
            src="/images/home/aerial.jpg"
            alt="AI-generated aerial view of farmland"
            fill
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />

          <div className="absolute inset-4 rounded-card border border-paper/20 bg-paper/10 p-3 backdrop-blur-md md:inset-auto md:bottom-8 md:left-8 md:w-[320px]">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
              Zianda overview
            </p>
            <p className="mt-2 text-lg font-semibold text-ink">Zianda Home Farm</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-control bg-ivory/80 px-2 py-2">4 livestock</div>
              <div className="rounded-control bg-ivory/80 px-2 py-2">1 active field</div>
              <div className="rounded-control bg-ivory/80 px-2 py-2">0 urgent health</div>
              <div className="rounded-control bg-ivory/80 px-2 py-2">R0 revenue</div>
            </div>
          </div>

          {indicators.map((item, index) => (
            <ScrollReveal
              key={item.label}
              delay={180 + index * 70}
              className="home-float-chip absolute rounded-full border border-paper/30 bg-paper/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur-sm"
              style={{ top: item.top, left: item.left } as React.CSSProperties}
            >
              {item.label}
            </ScrollReveal>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

export function LivestockSection() {
  return (
    <section id="solutions" className="overflow-hidden bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <ScrollReveal className="relative min-h-[460px] overflow-hidden rounded-card md:min-h-[560px]">
          <Image
            src="/images/home/livestock.jpg"
            alt="AI-generated cattle grazing on grassland"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-700 hover:scale-[1.02]"
          />
          <div className="home-animal-card absolute bottom-6 left-6 right-6 rounded-card border border-stone/80 bg-paper/95 p-4 shadow-lift backdrop-blur-sm md:right-auto md:w-[280px]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">Cow 102</p>
            <p className="mt-1 text-lg font-semibold text-ink">Brahman · Female · 3 years</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Health</span>
                <span className="font-medium text-crop">Healthy</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Last vaccination</span>
                <span className="font-medium">12 Aug 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Next care</span>
                <span className="font-medium">14 Sep 2026</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="section-eyebrow">Livestock</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Know every animal in the herd.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
            Track health, history, breeding and important events without losing sight of the
            bigger picture.
          </p>
          <TextLink href="/register" className="mt-8">
            Explore Livestock
          </TextLink>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function CropsSection() {
  const fields = [
    { id: "01", crop: "Maize", area: "12 ha", top: "24%", left: "18%" },
    { id: "02", crop: "Wheat", area: "18 ha", top: "48%", left: "52%" },
    { id: "03", crop: "Vegetables", area: "6 ha", top: "66%", left: "28%" }
  ];
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="relative bg-ink py-20 text-paper md:py-28">
      <div className="absolute inset-0 opacity-40">
        <Image src="/images/home/crops.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/60" />

      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
        <ScrollReveal className="max-w-xl">
          <p className="section-eyebrow !text-wheat">Crops</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Know what&apos;s happening in every field.
          </h2>
        </ScrollReveal>

        <ScrollReveal className="relative mt-12 min-h-[380px] md:min-h-[480px]" delay={100}>
          <Image
            src="/images/home/aerial.jpg"
            alt="Aerial crop fields"
            fill
            sizes="100vw"
            className="rounded-card object-cover"
          />
          {fields.map((field) => (
            <button
              key={field.id}
              type="button"
              aria-expanded={active === field.id}
              onClick={() => setActive(active === field.id ? null : field.id)}
              className="home-field-marker absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: field.top, left: field.left }}
            >
              <span className="home-field-pulse flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper bg-ink/70 text-[10px] font-bold">
                {field.id}
              </span>
              {active === field.id && (
                <span className="absolute left-1/2 top-full z-10 mt-2 w-36 -translate-x-1/2 rounded-control border border-stone bg-paper px-3 py-2 text-left text-xs text-ink shadow-lift">
                  <span className="font-semibold">Field {field.id}</span>
                  <br />
                  {field.crop} · {field.area}
                </span>
              )}
            </button>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

export function FarmMovingSection() {
  return (
    <section className="overflow-hidden bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <ScrollReveal>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            The farm is always moving.
            <br />
            <span className="text-ink-muted">Zianda keeps up.</span>
          </h2>
        </ScrollReveal>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-none md:mt-12 md:gap-6">
          {FARM_STAGES.map((stage, index) => (
            <ScrollReveal
              key={stage.label}
              delay={index * 80}
              className="home-stage-card group relative min-w-[220px] flex-1 overflow-hidden rounded-card md:min-w-[240px]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={stage.image}
                  alt={stage.label}
                  fill
                  sizes="240px"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm font-semibold text-paper">{stage.label}</p>
                  <ArrowRight
                    aria-hidden={index === FARM_STAGES.length - 1}
                    className={`mt-2 h-4 w-4 text-wheat ${
                      index === FARM_STAGES.length - 1 ? "invisible" : ""
                    }`}
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function QrSection() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <ScrollReveal className="relative min-h-[420px] overflow-hidden rounded-card">
          <Image
            src="/images/home/qr.jpg"
            alt="AI-generated farmer with livestock"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <p className="section-eyebrow">QR tracking</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Scan the tag.
            <br />
            Know the story.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
            Give every animal, field and record a digital identity.
          </p>

          <div className="home-scan-ui relative mt-8 max-w-xs overflow-hidden rounded-card border border-stone bg-ivory p-4 shadow-soft">
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <QrCode className="h-4 w-4" />
              Scan health card
            </div>
            <div className="relative mt-4 aspect-square rounded-control border border-dashed border-stone-strong bg-paper">
              <div className="absolute inset-4 grid grid-cols-5 gap-1 opacity-30">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span key={i} className="bg-ink" />
                ))}
              </div>
              <div className="home-scan-line absolute inset-x-3 h-px bg-crop/80" />
            </div>
          </div>

          <TextLink href="/register" className="mt-8">
            Explore QR Tracking
          </TextLink>
        </ScrollReveal>
      </div>
    </section>
  );
}

function AnimatedCounter(props: { value: number; suffix?: string; active: boolean }) {
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!props.active || reduced) {
      setDisplay(props.value);
      return;
    }
    let frame = 0;
    const total = 36;
    const id = window.setInterval(() => {
      frame += 1;
      setDisplay((props.value * frame) / total);
      if (frame >= total) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [props.active, props.value, reduced]);

  return (
    <span className="tabular-nums">
      {props.value >= 0 ? "+" : ""}
      {display.toFixed(1)}
      {props.suffix}
    </span>
  );
}

export function IntelligenceSection() {
  const { ref, inView } = useInView(0.25);

  return (
    <section ref={ref} className="bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <ScrollReveal>
          <p className="section-eyebrow !text-wheat">Farm intelligence</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            From farm records
            <br />
            to better decisions.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INSIGHTS.map((item, index) => (
            <ScrollReveal
              key={item.label}
              delay={index * 90}
              className="rounded-card border border-paper/10 bg-paper/5 p-5 backdrop-blur-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wider text-paper/55">
                {item.label}
              </p>
              <p
                className={`mt-3 text-3xl font-semibold tracking-tight ${
                  item.positive ? "text-crop-soft" : "text-wheat"
                }`}
              >
                <AnimatedCounter value={item.value} suffix={item.suffix} active={inView} />
              </p>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-paper/10">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.positive ? "bg-crop" : "bg-wheat"
                  } ${inView ? "w-full" : "w-0"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FarmerSection() {
  return (
    <section className="relative min-h-[520px] overflow-hidden">
      <Image
        src="/images/home/farmer.jpg"
        alt="AI-generated farmer in a crop field"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25" />
      <div className="relative mx-auto flex min-h-[520px] max-w-[1200px] items-end px-5 py-16 md:items-center md:px-8 md:py-24">
        <ScrollReveal className="max-w-xl">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-paper md:text-5xl">
            Technology should work
            <br />
            for the people who work the land.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-paper/80">
            Zianda is designed around the realities of African farming — from field operations
            and livestock management to connectivity and everyday decisions.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function MarketplaceSection() {
  return (
    <section id="marketplace" className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <ScrollReveal className="max-w-xl">
          <p className="section-eyebrow">Marketplace</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            From farm
            <br />
            to market.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Connect production with opportunity.
          </p>
        </ScrollReveal>

        <div className="mt-10 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {MARKET_LISTINGS.map((item, index) => (
            <ScrollReveal
              key={item.title}
              delay={index * 70}
              className="home-market-card group min-w-[260px] max-w-[280px] flex-1 overflow-hidden rounded-card bg-paper shadow-soft"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="280px"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                  {item.category}
                </p>
                <p className="mt-1 font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-xs text-ink-subtle">{item.location}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{item.price}</p>
                  <ArrowRight className="h-4 w-4 text-ink-subtle transition group-hover:translate-x-1 group-hover:text-ink" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="home-final-cta relative min-h-[480px] overflow-hidden">
      <Image
        src="/images/home/aerial.jpg"
        alt="AI-generated farmland from above"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="relative mx-auto flex min-h-[480px] max-w-[1200px] flex-col items-center justify-center px-5 py-20 text-center md:px-8">
        <ScrollReveal>
          <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-paper md:text-5xl">
            One hub for the work that actually happens on the farm.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-paper/80">
            Manage your farm with clarity, confidence and control.
          </p>
          <CtaButton href="/register" variant="light" className="mt-8">
            Start Managing Your Farm
          </CtaButton>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer id="resources" className="border-t border-stone bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <p className="text-lg font-semibold tracking-tight text-ink">Zianda Agri-Hub</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              The digital farming platform built for Africa.
            </p>
          </div>
          <FooterCol
            title="Platform"
            links={[
              ["Livestock", "/register"],
              ["Crops", "/register"],
              ["Health", "/register"],
              ["Finance", "/register"],
              ["Marketplace", "/register"]
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["About", "/register"],
              ["Contact", "/register"],
              ["Support", "/register"]
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              ["Farmer Hub", "/register"],
              ["Education", "/register"],
              ["Guides", "/register"]
            ]}
          />
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-stone pt-6 text-xs text-ink-subtle">
          <p>© {new Date().getFullYear()} Zianda Agri-Hub. All rights reserved.</p>
          <p>AI-generated agricultural imagery.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol(props: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
        {props.title}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {props.links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-ink-muted transition hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
