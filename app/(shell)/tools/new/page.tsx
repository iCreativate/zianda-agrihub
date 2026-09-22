"use client";

import { FormPage } from "@/components/shell/form-page";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ToolEntry } from "../page";
import { uploadItemImage } from "@/lib/supabase/upload";

const STORAGE_KEY = "zianda_tools";
const CATEGORIES = ["Hand tools", "Power tools", "Implements", "Measuring & fencing", "Other"];

export default function NewToolPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const id = crypto.randomUUID();
      let imageUrl: string | undefined;
      if (imageFile) imageUrl = await uploadItemImage(imageFile, "tools", id);
      const entries: ToolEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const newEntry: ToolEntry = {
        id,
        name: name.trim() || "Unnamed tool",
        category,
        condition: condition.trim(),
        location: location.trim(),
        imageUrl,
        addedAt: new Date().toISOString(),
      };
      entries.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      router.push("/tools");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormPage
      backHref="/tools"
      backLabel="Back to tools"
      eyebrow="Yard"
      title="Add tool"
      description="Record hand tools, power tools, and farm implements."
      image="/images/home/machinery.jpg"
    >
      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div role="alert" className="alert-error">{error}</div>
        )}
        <div>
          <label className="label-field" htmlFor="name">
            Tool name or description
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Spade, Angle grinder, Planter"
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field mt-1"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="condition">
            Condition (optional)
          </label>
          <input
            id="condition"
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="e.g. Good, Needs repair"
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="location">
            Storage location (optional)
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Shed 1, Tool rack"
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="label-field">Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-stone file:px-3 file:py-1.5 file:text-ink-muted" />
          {imageFile && <p className="mt-1 text-xs text-ink-subtle">{imageFile.name}</p>}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Add tool"}
          </button>
          <Link href="/tools" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </FormPage>
  );
}
