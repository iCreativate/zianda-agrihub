import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

const articles: Record<
  string,
  { title: string; category: string; body: string }
> = {
  "climate-smart-practices": {
    title: "Climate-smart practices for smallholder farmers",
    category: "Latest trends",
    body: `
Climate variability is affecting planting seasons and crop yields. This guide outlines simple steps to adapt.

**Adjust planting dates** – Track rainfall and soil moisture in Zianda Agri-Hub so you can shift planting by a few weeks when the season is late or early.

**Diversify crops and varieties** – Consider short-season or drought-tolerant varieties for part of your land to spread risk.

**Keep records** – Use the app to log what you planted, when, and what inputs you used. Over time you’ll see which practices perform best in your area.

**Livestock** – Plan feed and water ahead of dry spells. Record animal health and vaccinations so you can respond quickly if disease pressure increases.
    `.trim(),
  },
  "vaccination-calendars": {
    title: "Livestock vaccination calendars by region",
    category: "Latest trends",
    body: `
Vaccination schedules depend on local disease risk and regulations. Always follow your vet’s advice.

**Common cattle vaccines** – Brucellosis (often around 3–6 months), Anthrax (as per local schedule), and others recommended in your region. Zianda Agri-Hub can suggest dates based on each animal’s date of birth.

**Small ruminants and poultry** – Different products and timing apply. Log every vaccination in the app so you never miss a booster.

**QR health cards** – When you scan an animal’s QR code in the kraal, you see its vaccination history at a glance. Useful for sales and for vets.
    `.trim(),
  },
  "soil-health-monitoring": {
    title: "Soil health: pH and moisture monitoring",
    category: "Latest trends",
    body: `
Simple soil logs can improve your fertilizer and irrigation decisions.

**pH** – Soils that are too acidic or alkaline limit nutrient uptake. Test periodically and log results in your crop block in Zianda Agri-Hub. Lime or other amendments can be scheduled and recorded.

**Moisture** – Note moisture levels when you scout. Over time you’ll see patterns and can time irrigation or planting better.

**Fertilizer and pesticide schedules** – Record what you applied and when. This helps you avoid overuse and supports traceability for buyers.
    `.trim(),
  },
  "record-keeping-basics": {
    title: "Getting started with farm record-keeping",
    category: "Farmer education",
    body: `
Good records help you get loans, meet buyer requirements, and manage your farm better.

**Why it matters** – Banks and buyers often want proof of production, costs, and animal or crop history. Zianda Agri-Hub keeps everything in one place.

**Start small** – Add a few animals or crop blocks and log key events: births, planting dates, vaccinations, and costs. You can expand as you get used to it.

**Offline use** – You can log data in the field; the app syncs when you’re back online. No need to remember everything until you get home.
    `.trim(),
  },
  "burn-rate-cash-flow": {
    title: "Understanding your burn rate and cash flow",
    category: "Farmer education",
    body: `
“Burn rate” is how much you spend in a period (e.g. per month). Knowing it helps you plan.

**Track by category** – In Finances, record feed, labour, medical, fertilizer, and other costs. Link transactions to specific livestock or crop blocks when possible.

**Monthly view** – Your dashboard shows total spend and projected yield for the month. Use it to see when cash might be tight and when you can invest.

**Seasonal planning** – Before planting or buying feed, check past months in the app. Plan sales and purchases so income and expenses align.
    `.trim(),
  },
  "qr-traceability": {
    title: "QR codes and traceability for buyers",
    category: "Farmer education",
    body: `
Buyers and cooperatives increasingly want proof of origin and animal or crop history.

**Health cards** – Each animal or crop block in Zianda Agri-Hub can have a QR code. When someone scans it, they see the health card: ID, vaccinations, treatments, and (for animals) photos over time.

**Block IDs** – For crops, the block ID and input schedule (fertilizer, pesticide, dates) show how the crop was managed. Useful for quality and compliance.

**Audit report** – Use the “Audit report” feature to generate a PDF of herd health and costs. Handy for banks or investors who want a snapshot of your operation.
    `.trim(),
  },
};

interface EducationArticlePageProps {
  params: { slug: string };
}

export default function EducationArticlePage({ params }: EducationArticlePageProps) {
  const article = articles[params.slug];
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/education"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Education
      </Link>

      <article>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {article.category}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {article.title}
        </h1>
        <div className="mt-6 max-w-none text-sm text-slate-100">
          {article.body.split("\n\n").map((block, i) => {
            if (block.startsWith("**") && block.endsWith("**")) {
              return (
                <p key={i} className="mt-2 font-semibold text-white">
                  {block.replace(/\*\*/g, "")}
                </p>
              );
            }
            const parts = block.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className="mt-2">
                {parts.map((part, j) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={j} className="font-semibold text-white">
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
            );
          })}
        </div>
      </article>

      <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/80 px-4 py-3">
        <BookOpen className="h-5 w-5 text-emerald-400" />
        <Link href="/education" className="text-sm font-medium text-slate-200 hover:text-white">
          Browse more articles
        </Link>
      </div>
    </div>
  );
}
