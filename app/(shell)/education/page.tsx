"use client";

import Link from "next/link";
import { BookOpen, TrendingUp, GraduationCap, ArrowRight } from "lucide-react";

const latestTrends = [
  {
    id: "1",
    title: "Climate-smart practices for smallholder farmers",
    excerpt:
      "How to adapt planting dates and crop choices to shifting rainfall patterns and reduce risk.",
    category: "Latest trends",
    slug: "climate-smart-practices",
  },
  {
    id: "2",
    title: "Livestock vaccination calendars by region",
    excerpt:
      "Recommended schedules for Brucellosis, Anthrax, and other common vaccines based on local disease pressure.",
    category: "Latest trends",
    slug: "vaccination-calendars",
  },
  {
    id: "3",
    title: "Soil health: pH and moisture monitoring",
    excerpt:
      "Simple ways to log and interpret soil data to improve fertilizer and irrigation decisions.",
    category: "Latest trends",
    slug: "soil-health-monitoring",
  },
];

const farmerEducation = [
  {
    id: "4",
    title: "Getting started with farm record-keeping",
    excerpt:
      "Why records matter for loans and markets, and how to keep them without extra hassle.",
    category: "Farmer education",
    slug: "record-keeping-basics",
  },
  {
    id: "5",
    title: "Understanding your burn rate and cash flow",
    excerpt:
      "Track costs by month and by enterprise so you know when cash is tight and when to sell.",
    category: "Farmer education",
    slug: "burn-rate-cash-flow",
  },
  {
    id: "6",
    title: "QR codes and traceability for buyers",
    excerpt:
      "How health cards and block IDs help you prove quality and origin to buyers and cooperatives.",
    category: "Farmer education",
    slug: "qr-traceability",
  },
];

export default function EducationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Education
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Latest trends and practical guides to help you run your farm better.
        </p>
      </div>

      <section>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-50">Latest trends</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {latestTrends.map((item) => (
            <li key={item.id}>
              <article className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {item.category}
                </p>
                <h3 className="mt-1 font-semibold text-slate-50">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.excerpt}</p>
                <Link
                  href={`/education/${item.slug}`}
                  className="btn-secondary mt-3"
                >
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-50">
            Farmer education
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {farmerEducation.map((item) => (
            <li key={item.id}>
              <article className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {item.category}
                </p>
                <h3 className="mt-1 font-semibold text-slate-50">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.excerpt}</p>
                <Link
                  href={`/education/${item.slug}`}
                  className="btn-secondary mt-3"
                >
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-6 shadow-md shadow-black/40">
        <div className="flex items-start gap-3">
          <BookOpen className="h-8 w-8 shrink-0 text-emerald-400" />
          <div>
            <h3 className="font-semibold text-slate-50">More coming soon</h3>
            <p className="mt-1 text-sm text-slate-300">
              We add new articles on markets, animal health, crop management,
              and finance. Check back or use the app to get reminders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
