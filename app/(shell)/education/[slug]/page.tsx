import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, HeartPulse, QrCode, Sprout, Wallet } from "lucide-react";
import { AppPage } from "@/components/shell/app-page";
import { SubPageBanner } from "@/components/ui/sub-page-banner";

const articles: Record<
  string,
  {
    title: string;
    category: string;
    lede: string;
    body: string;
    relatedHref: string;
    relatedLabel: string;
  }
> = {
  "climate-smart-practices": {
    title: "Climate-smart practices for smallholder farmers",
    category: "Latest trends",
    lede: "Simple ways to adapt planting, crops, and livestock when the season won’t sit still.",
    relatedHref: "/vegetation",
    relatedLabel: "Open crop fields",
    body: `
Climate variability is affecting planting seasons and crop yields. This guide outlines simple steps to adapt.

**Adjust planting dates** – Track rainfall and soil moisture in Zianda Agri-Hub so you can shift planting by a few weeks when the season is late or early.

**Diversify crops and varieties** – Consider short-season or drought-tolerant varieties for part of your land to spread risk.

**Keep records** – Use the app to log what you planted, when, and what inputs you used. Over time you’ll see which practices perform best in your area.

**Livestock** – Plan feed and water ahead of dry spells. Record animal health and vaccinations so you can respond quickly if disease pressure increases.
    `.trim()
  },
  "vaccination-calendars": {
    title: "Livestock vaccination calendars by region",
    category: "Latest trends",
    lede: "Keep due dates visible so the herd stays protected and market-ready.",
    relatedHref: "/vaccinations",
    relatedLabel: "Open health calendar",
    body: `
Vaccination schedules depend on local disease risk and regulations. Always follow your vet’s advice.

**Common cattle vaccines** – Brucellosis (often around 3–6 months), Anthrax (as per local schedule), and others recommended in your region. Zianda Agri-Hub can suggest dates based on each animal’s date of birth.

**Small ruminants and poultry** – Different products and timing apply. Log every vaccination in the app so you never miss a booster.

**QR health cards** – When you scan an animal’s QR code in the kraal, you see its vaccination history at a glance. Useful for sales and for vets.
    `.trim()
  },
  "soil-health-monitoring": {
    title: "Soil health: pH and moisture monitoring",
    category: "Latest trends",
    lede: "Log what the soil is telling you so fertilizer and irrigation land at the right time.",
    relatedHref: "/vegetation",
    relatedLabel: "Open crop fields",
    body: `
Simple soil logs can improve your fertilizer and irrigation decisions.

**pH** – Soils that are too acidic or alkaline limit nutrient uptake. Test periodically and log results in your crop block in Zianda Agri-Hub. Lime or other amendments can be scheduled and recorded.

**Moisture** – Note moisture levels when you scout. Over time you’ll see patterns and can time irrigation or planting better.

**Fertilizer and pesticide schedules** – Record what you applied and when. This helps you avoid overuse and supports traceability for buyers.
    `.trim()
  },
  "record-keeping-basics": {
    title: "Getting started with farm record-keeping",
    category: "Farmer education",
    lede: "Start small, stay consistent, and keep proof ready for loans, buyers, and your own decisions.",
    relatedHref: "/livestock",
    relatedLabel: "Open livestock",
    body: `
Good records help you get loans, meet buyer requirements, and manage your farm better.

**Why it matters** – Banks and buyers often want proof of production, costs, and animal or crop history. Zianda Agri-Hub keeps everything in one place.

**Start small** – Add a few animals or crop blocks and log key events: births, planting dates, vaccinations, and costs. You can expand as you get used to it.

**Offline use** – You can log data in the field; the app syncs when you’re back online. No need to remember everything until you get home.
    `.trim()
  },
  "burn-rate-cash-flow": {
    title: "Understanding your burn rate and cash flow",
    category: "Farmer education",
    lede: "See what you spend each month so you know when cash is tight and when you can invest.",
    relatedHref: "/finances/burn-vs-yield",
    relatedLabel: "Open burn vs yield",
    body: `
“Burn rate” is how much you spend in a period (e.g. per month). Knowing it helps you plan.

**Track by category** – In Finances, record feed, labour, medical, fertilizer, and other costs. Link transactions to specific livestock or crop blocks when possible.

**Monthly view** – Your dashboard shows total spend and projected yield for the month. Use it to see when cash might be tight and when you can invest.

**Seasonal planning** – Before planting or buying feed, check past months in the app. Plan sales and purchases so income and expenses align.
    `.trim()
  },
  "qr-traceability": {
    title: "QR codes and traceability for buyers",
    category: "Farmer education",
    lede: "Prove origin and history with tags buyers and cooperatives can trust.",
    relatedHref: "/scan",
    relatedLabel: "Open QR scanner",
    body: `
Buyers and cooperatives increasingly want proof of origin and animal or crop history.

**Health cards** – Each animal or crop block in Zianda Agri-Hub can have a QR code. When someone scans it, they see the health card: ID, vaccinations, treatments, and (for animals) photos over time.

**Block IDs** – For crops, the block ID and input schedule (fertilizer, pesticide, dates) show how the crop was managed. Useful for quality and compliance.

**Audit report** – Use the “Audit report” feature to generate a PDF of herd health and costs. Handy for banks or investors who want a snapshot of your operation.
    `.trim()
  }
};

const practiceLinks = [
  { href: "/vaccinations", label: "Health", icon: HeartPulse },
  { href: "/finances", label: "Finances", icon: Wallet },
  { href: "/scan", label: "QR tags", icon: QrCode },
  { href: "/vegetation", label: "Crops", icon: Sprout }
];

interface EducationArticlePageProps {
  params: { slug: string };
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

export default function EducationArticlePage({ params }: EducationArticlePageProps) {
  const article = articles[params.slug];
  if (!article) notFound();

  const blocks = article.body.split("\n\n").filter(Boolean);
  const intro = blocks[0];
  const points = blocks.slice(1);

  return (
    <AppPage
      hero={
        <SubPageBanner
          backHref="/education"
          backLabel="Back to education"
          eyebrow={article.category}
          title={article.title}
          description={article.lede}
          image="/images/home/farmer.jpg"
        />
      }
    >
      <article className="overflow-hidden rounded-card border border-stone/90 bg-paper/95 shadow-soft backdrop-blur-sm">
        <div className="space-y-6 px-5 py-6 md:px-8 md:py-8">
          <p className="text-[15px] leading-relaxed text-ink-muted">{renderInline(intro)}</p>

          <ol className="space-y-3">
            {points.map((block, index) => {
              const match = block.match(/^\*\*([^*]+)\*\*\s*[–—-]?\s*(.*)$/s);
              const title = match?.[1]?.trim() ?? `Point ${index + 1}`;
              const detail = (match?.[2] ?? block.replace(/\*\*/g, "")).trim();

              return (
                <li
                  key={index}
                  className="rounded-control border border-stone bg-ivory px-4 py-4 md:px-5"
                >
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-paper font-mono text-xs font-semibold text-ink-subtle">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {renderInline(detail)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <footer className="flex flex-col gap-3 border-t border-stone bg-ivory/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="inline-flex items-center gap-2 text-sm text-ink-muted">
            <BookOpen className="h-4 w-4 text-crop" />
            Apply this on the farm
          </div>
          <Link href={article.relatedHref} className="btn-primary min-h-11">
            {article.relatedLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </footer>
      </article>

      <section className="surface p-5">
        <p className="section-eyebrow">More learning</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/education" className="btn-secondary">
            Browse all guides
          </Link>
          {practiceLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="btn-secondary">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>
    </AppPage>
  );
}
