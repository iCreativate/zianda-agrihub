"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import { buildVaccinationScheduleForCalf } from "@/lib/health/vaccination-schedule";
import type { Livestock, LivestockSpecies } from "@/types/agriculture";

const speciesOptions: LivestockSpecies[] = [
  "cattle",
  "goat",
  "sheep",
  "poultry",
  "pig",
  "dog",
  "other"
];

const breedSuggestions: Record<LivestockSpecies, string[]> = {
  cattle: [
    "Brahman",
    "Boran",
    "Nguni",
    "Holstein",
    "Jersey",
    "Angus",
    "Simmental",
    "Hereford",
    "Charolais",
    "Afrikaner"
  ],
  goat: [
    "Boer",
    "Kalahari Red",
    "Saanen",
    "Toggenburg",
    "Alpine",
    "Nubian",
    "Angora",
    "Savanna"
  ],
  sheep: [
    "Dorper",
    "Merino",
    "Suffolk",
    "Dorset",
    "Hampshire",
    "Texel",
    "Damara",
    "Southdown"
  ],
  poultry: [
    "Broiler",
    "Layer",
    "Cobb 500",
    "Ross 308",
    "Rhode Island Red",
    "Leghorn",
    "Kuroiler",
    "Koekoek"
  ],
  pig: [
    "Landrace",
    "Large White",
    "Duroc",
    "Pietrain",
    "Hampshire",
    "Chester White",
    "Spotted",
    "Berkshire"
  ],
  dog: [
    "German Shepherd",
    "Labrador Retriever",
    "Golden Retriever",
    "Belgian Malinois",
    "Staffordshire Bull Terrier",
    "Rottweiler",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Boxer"
  ],
  other: []
};

export default function NewLivestockPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [externalId, setExternalId] = useState("");
  const [species, setSpecies] = useState<LivestockSpecies>("cattle");
  const [breed, setBreed] = useState("");
  const [dob, setDob] = useState("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [sireExternalId, setSireExternalId] = useState("");
  const [damExternalId, setDamExternalId] = useState("");
  const [initialVaccineName, setInitialVaccineName] = useState("");
  const [initialVaccineDate, setInitialVaccineDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = getSupabaseClient();

    const nowIso = new Date().toISOString();
    const baseId = externalId.trim() || `AN-${Date.now()}`;

    const payload = {
      external_id: baseId,
      name: name.trim() || baseId,
      species,
      breed: breed.trim() || null,
      date_of_birth: dob || null,
      weight_kg: weightKg ? Number(weightKg) : null,
      qr_code: baseId
    };

    try {
      const { data, error: insertError } = await supabase
        .from("livestock")
        .insert(payload)
        .select("*")
        .single();

      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }

      const created: Livestock = {
        id: data.id,
        externalId: data.external_id,
        name: data.name,
        species: data.species,
        breed: data.breed ?? undefined,
        dateOfBirth: data.date_of_birth ?? undefined,
        weightKg: data.weight_kg ?? undefined,
        qrCode: data.qr_code ?? undefined,
        photoUrl: data.photo_url ?? undefined,
        createdAt: data.created_at ?? nowIso,
        updatedAt: data.updated_at ?? nowIso
      };

      const schedule = buildVaccinationScheduleForCalf(created);
      if (schedule.length > 0) {
        await supabase.from("vaccination_schedule_items").insert(
          schedule.map((item) => ({
            livestock_id: item.livestockId,
            vaccine_name: item.vaccineName,
            recommended_age_days: item.recommendedAgeDays,
            scheduled_date: item.scheduledDate,
            completed: item.completed
          }))
        );
      }

      // Optional lineage links based on sire/dam IDs
      const lineageIds = [sireExternalId.trim(), damExternalId.trim()].filter(Boolean);
      if (lineageIds.length > 0) {
        const { data: parents } = await supabase
          .from("livestock")
          .select("id, external_id")
          .in("external_id", lineageIds);

        const parentByExternalId =
          (parents ?? []).reduce<Record<string, string>>((acc, row: any) => {
            acc[row.external_id] = row.id;
            return acc;
          }, {});

        const lineageInserts: Array<{
          livestock_id: string;
          parent_id: string;
          relationship: "sire" | "dam";
        }> = [];

        if (sireExternalId.trim() && parentByExternalId[sireExternalId.trim()]) {
          lineageInserts.push({
            livestock_id: created.id,
            parent_id: parentByExternalId[sireExternalId.trim()],
            relationship: "sire"
          });
        }
        if (damExternalId.trim() && parentByExternalId[damExternalId.trim()]) {
          lineageInserts.push({
            livestock_id: created.id,
            parent_id: parentByExternalId[damExternalId.trim()],
            relationship: "dam"
          });
        }

        if (lineageInserts.length > 0) {
          await supabase.from("livestock_lineage").insert(lineageInserts);
        }
      }

      // Optional initial vaccination record
      if (initialVaccineName.trim() && initialVaccineDate) {
        await supabase.from("vaccination_records").insert({
          livestock_id: created.id,
          vaccine_name: initialVaccineName.trim(),
          scheduled_date: initialVaccineDate,
          administered_date: initialVaccineDate
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["livestock-list"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
      router.push("/livestock");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save animal. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Add animal
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Add a new animal to your herd. We&apos;ll generate a QR health card so you can
            scan and view records in the kraal.
          </p>
        </div>
        <Link
          href="/livestock"
          className="text-sm font-medium text-slate-300 hover:text-white"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card-shell space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="animal-name">
              Name
            </label>
            <input
              id="animal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cow 101"
              className="input-dark mt-1"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-slate-200"
              htmlFor="animal-external-id"
            >
              Animal ID (optional)
            </label>
            <input
              id="animal-external-id"
              type="text"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              placeholder="If empty, we will generate one"
              className="input-dark mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">
              Use your ear-tag, collar, or kennel number. This ID is also printed on the QR tag.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="animal-species">
              Species
            </label>
            <select
              id="animal-species"
              value={species}
              onChange={(e) => setSpecies(e.target.value as LivestockSpecies)}
              className="input-dark mt-1"
            >
              {speciesOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              Choose the closest species. Breeders can use breed + lineage to track bloodlines
              (e.g. dogs).
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="animal-breed">
              Breed (optional)
            </label>
            <input
              id="animal-breed"
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g. Brahman"
              list="breed-options"
              className="input-dark mt-1"
            />
            <datalist id="breed-options">
              {breedSuggestions[species].map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="animal-weight">
              Current weight (kg, optional)
            </label>
            <input
              id="animal-weight"
              type="number"
              min="0"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="input-dark mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">
              Optional, but useful for dosing, growth tracking, and sale planning.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-200" htmlFor="animal-dob">
              Date of birth (for schedule)
            </label>
            <input
              id="animal-dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="input-dark mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">
              If you set a DOB for cattle, we will propose a schedule (for example: Brucellosis
              around 3 months, Anthrax around 6 months).
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              Lineage &amp; parentage (optional)
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Link this animal to an existing sire and dam using their Animal IDs. This helps with
              breeding records and traceability.
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label
                className="block text-sm font-medium text-slate-200"
                htmlFor="animal-sire-id"
              >
                Sire ID (father)
              </label>
              <input
                id="animal-sire-id"
                type="text"
                value={sireExternalId}
                onChange={(e) => setSireExternalId(e.target.value)}
                placeholder="Animal ID of sire (must already exist)"
                className="input-dark mt-1"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-slate-200"
                htmlFor="animal-dam-id"
              >
                Dam ID (mother)
              </label>
              <input
                id="animal-dam-id"
                type="text"
                value={damExternalId}
                onChange={(e) => setDamExternalId(e.target.value)}
                placeholder="Animal ID of dam (must already exist)"
                className="input-dark mt-1"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              Vaccination (optional)
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Record a vaccine this animal has already received. Future vaccines will be suggested
              automatically from the schedule.
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label
                className="block text-sm font-medium text-slate-200"
                htmlFor="animal-vaccine-name"
              >
                Vaccine name
              </label>
              <input
                id="animal-vaccine-name"
                type="text"
                value={initialVaccineName}
                onChange={(e) => setInitialVaccineName(e.target.value)}
                placeholder="e.g. Brucellosis"
                className="input-dark mt-1"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-slate-200"
                htmlFor="animal-vaccine-date"
              >
                Date given
              </label>
              <input
                id="animal-vaccine-date"
                type="date"
                value={initialVaccineDate}
                onChange={(e) => setInitialVaccineDate(e.target.value)}
                className="input-dark mt-1"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:opacity-60"
        >
          {submitting ? "Saving animal…" : "Save animal"}
        </button>
      </form>

      <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-800/40 p-5 text-sm text-slate-300">
        <p className="font-semibold text-slate-50">What happens after you save?</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            We create a QR health card for this animal that you can scan in the kraal or
            kennel.
          </li>
          <li>
            You can upload photos to build a symptom and recovery timeline over time.
          </li>
          <li>
            You can link sire and dam for lineage, and record vaccinations and treatments.
          </li>
          <li>
            You can log feed, medical, and labour costs directly against this animal for
            better financial reports.
          </li>
        </ul>
      </div>
    </div>
  );
}

