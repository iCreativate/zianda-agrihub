"use client";

import { MARKETPLACE_CATEGORIES } from "@/lib/marketplace/constants";

export function CategoryNav(props: {
  active: string;
  onChange: (category: string) => void;
}) {
  return (
    <nav aria-label="Categories" className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      {MARKETPLACE_CATEGORIES.map((category) => {
        const active = props.active === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => props.onChange(category.id)}
            className={`group flex min-w-[88px] shrink-0 flex-col items-center gap-2 transition ${
              active ? "opacity-100" : "opacity-80 hover:opacity-100"
            }`}
          >
            <span
              className={`relative h-16 w-16 overflow-hidden rounded-full ring-2 transition ${
                active ? "ring-ink scale-105" : "ring-transparent group-hover:ring-stone-strong"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt=""
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </span>
            <span
              className={`text-xs font-medium ${
                active ? "text-ink" : "text-ink-muted group-hover:text-ink"
              }`}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
