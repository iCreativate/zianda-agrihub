"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, X } from "lucide-react";
import {
  CONDITION_OPTIONS,
  MARKETPLACE_CATEGORIES,
  SELLER_TYPE_OPTIONS
} from "@/lib/marketplace/constants";
import {
  activeFilterCount,
  DEFAULT_FILTERS,
  type MarketplaceFilters
} from "@/lib/marketplace/storage";

function FilterFields(props: {
  filters: MarketplaceFilters;
  onChange: (patch: Partial<MarketplaceFilters>) => void;
}) {
  const { filters, onChange } = props;

  return (
    <div className="space-y-4">
      <div>
        <label className="label-field">Intent</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["all", "selling", "buying"] as const).map((intent) => (
            <button
              key={intent}
              type="button"
              onClick={() => onChange({ intent })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filters.intent === intent
                  ? "bg-ink text-paper"
                  : "bg-ivory-deep text-ink-muted hover:text-ink"
              }`}
            >
              {intent === "all" ? "All" : intent === "selling" ? "For sale" : "Wanted"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="filter-category">
          Category
        </label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="input-field mt-1"
        >
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-field" htmlFor="filter-location">
          Location
        </label>
        <input
          id="filter-location"
          type="text"
          value={filters.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="e.g. Free State"
          className="input-field mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-field" htmlFor="filter-min">
            Min price
          </label>
          <input
            id="filter-min"
            type="number"
            min={0}
            value={filters.priceMin}
            onChange={(e) => onChange({ priceMin: e.target.value })}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="filter-max">
            Max price
          </label>
          <input
            id="filter-max"
            type="number"
            min={0}
            value={filters.priceMax}
            onChange={(e) => onChange({ priceMax: e.target.value })}
            className="input-field mt-1"
          />
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="filter-condition">
          Condition
        </label>
        <select
          id="filter-condition"
          value={filters.condition}
          onChange={(e) => onChange({ condition: e.target.value })}
          className="input-field mt-1"
        >
          {CONDITION_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-field" htmlFor="filter-seller">
          Seller type
        </label>
        <select
          id="filter-seller"
          value={filters.sellerType}
          onChange={(e) => onChange({ sellerType: e.target.value })}
          className="input-field mt-1"
        >
          {SELLER_TYPE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-field" htmlFor="filter-sort">
          Sort
        </label>
        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as MarketplaceFilters["sort"] })}
          className="input-field mt-1"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="nearby">Nearest location</option>
        </select>
      </div>
    </div>
  );
}

export function ListingFilters(props: {
  filters: MarketplaceFilters;
  onChange: (filters: MarketplaceFilters) => void;
  resultCount: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = activeFilterCount(props.filters);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  function patch(patch: Partial<MarketplaceFilters>) {
    props.onChange({ ...props.filters, ...patch });
  }

  return (
    <>
      <div className="hidden items-center justify-between gap-4 rounded-control border border-stone bg-paper px-4 py-3 lg:flex">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink-muted">Filter</span>
          {(["all", "selling", "buying"] as const).map((intent) => (
            <button
              key={intent}
              type="button"
              onClick={() => patch({ intent })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                props.filters.intent === intent
                  ? "bg-ink text-paper"
                  : "bg-ivory-deep text-ink-muted hover:text-ink"
              }`}
            >
              {intent === "all" ? "All listings" : intent === "selling" ? "For sale" : "Wanted"}
            </button>
          ))}
          <select
            value={props.filters.category}
            onChange={(e) => patch({ category: e.target.value })}
            className="input-field w-auto min-h-9 py-1.5 text-xs"
            aria-label="Category"
          >
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={props.filters.sort}
            onChange={(e) => patch({ sort: e.target.value as MarketplaceFilters["sort"] })}
            className="input-field w-auto min-h-9 py-1.5 text-xs"
            aria-label="Sort"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="nearby">Nearest</option>
          </select>
        </div>
        <p className="text-sm text-ink-subtle">{props.resultCount} listings</p>
      </div>

      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn-secondary min-h-11 flex-1"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters{count > 0 ? ` (${count})` : ""}
        </button>
        <p className="text-sm text-ink-subtle">{props.resultCount} results</p>
      </div>

      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close filters"
              className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-card border border-stone bg-paper shadow-lift">
              <div className="sticky top-0 flex items-center justify-between border-b border-stone bg-paper px-5 py-4">
                <h2 className="text-base font-semibold text-ink">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-control border border-stone-strong"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="px-5 py-5">
                <FilterFields filters={props.filters} onChange={patch} />
              </div>
              <div className="sticky bottom-0 flex gap-2 border-t border-stone bg-paper px-5 py-4">
                <button
                  type="button"
                  onClick={() => props.onChange(DEFAULT_FILTERS)}
                  className="btn-secondary min-h-11 flex-1"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary min-h-11 flex-1"
                >
                  Show {props.resultCount}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
