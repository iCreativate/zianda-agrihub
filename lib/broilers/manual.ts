/**
 * AFGRI Animal Feeds — Poultry Product & Basic Broiler Management Manual (2021).
 * Structured for in-app reference. Nutrient units are g/kg unless noted.
 */

export type BroilerFeed = {
  code: string;
  regNo: string;
  name: string;
  class: string;
  objective: string;
  feeding: string;
  texture: string;
  packaging: string;
  notes: string[];
  nutrients: { nutrient: string; value: string; bound: string }[];
  highlights: string[];
};

export type GrowthRow = {
  week: number;
  dailyGainG: number;
  liveWeightG: number;
  weeklyFeedG: number;
  cumulativeFeedG: number;
  fcr: number;
};

export const broilerFeeds: BroilerFeed[] = [
  {
    code: "P1560",
    regNo: "V11209",
    name: "Broiler One Step",
    class: "Broiler Grower Feed",
    objective:
      "One-ration programme from day-old until slaughter — simplifies feed flow management.",
    feeding: "Feed ad libitum from day-old until slaughter. Fresh feed and water at all times.",
    texture: "Mash or Crumble",
    packaging: "10 kg and 40 kg bags",
    notes: ["Contains at least 5% genetically modified organisms"],
    nutrients: [
      { nutrient: "Protein", value: "180", bound: "Min" },
      { nutrient: "Lysine", value: "9", bound: "Min" },
      { nutrient: "Fat", value: "25", bound: "Min" },
      { nutrient: "Fibre", value: "60", bound: "Max" },
      { nutrient: "Calcium", value: "7 – 12", bound: "Min–Max" },
      { nutrient: "Phosphorus", value: "5", bound: "Min" }
    ],
    highlights: [
      "Meets nutritional needs from day-old to slaughter",
      "Highly digestible protein for body mass development",
      "Palatable to encourage intake and growth",
      "Single-phase feeding simplifies management"
    ]
  },
  {
    code: "P1561",
    regNo: "V16573",
    name: "Topgro Starter",
    class: "Broiler Starter Feed",
    objective:
      "Meets nutritional requirements of broilers from day-old until approximately 18 days.",
    feeding:
      "Two-phase: ad lib from day-old until ~20 days (1000 g/bird). Three-phase: ad lib until ~18 days (800 g/bird). Then Topgro Grower.",
    texture: "Mash or Crumble",
    packaging: "10 kg and 40 kg bags",
    notes: [
      "Highly digestible raw materials",
      "Includes growth promoter and coccidiostat",
      "Contains at least 5% genetically modified organisms"
    ],
    nutrients: [
      { nutrient: "Protein", value: "200", bound: "Min" },
      { nutrient: "Lysine", value: "12", bound: "Min" },
      { nutrient: "Fat", value: "25", bound: "Min" },
      { nutrient: "Fibre", value: "50", bound: "Max" },
      { nutrient: "Calcium", value: "9 – 12", bound: "Min–Max" },
      { nutrient: "Phosphorus", value: "6", bound: "Min" }
    ],
    highlights: [
      "Day-old chicks until ~18 days",
      "Palatable for early intake and development",
      "Digestible protein for body mass",
      "Standard growth promoter and coccidiostat"
    ]
  },
  {
    code: "P1562",
    regNo: "V16365",
    name: "Topgro Grower",
    class: "Broiler Grower Feed",
    objective:
      "Meets nutritional requirements from approximately 18 days until 28 days of age.",
    feeding:
      "Two-phase: ad lib from 20 days — ~2675 g/bird until ~40 days. Three-phase: ad lib from 18 days — ~1575 g/bird until 32 days, then Topgro Finisher.",
    texture: "Mash, Crumble or 3.2 mm Pellets",
    packaging: "10 kg and 40 kg bags",
    notes: [
      "Includes growth promoter and coccidiostat",
      "Contains at least 5% genetically modified organisms"
    ],
    nutrients: [
      { nutrient: "Protein", value: "180", bound: "Min" },
      { nutrient: "Lysine", value: "10.5", bound: "Min" },
      { nutrient: "Fat", value: "25", bound: "Min" },
      { nutrient: "Fibre", value: "60", bound: "Max" },
      { nutrient: "Calcium", value: "7 – 12", bound: "Min–Max" },
      { nutrient: "Phosphorus", value: "5", bound: "Min" }
    ],
    highlights: [
      "Growing period nutrition",
      "Palatable for intake and development",
      "Digestible protein for body mass",
      "Standard growth promoter and coccidiostat"
    ]
  },
  {
    code: "P1563",
    regNo: "V16366",
    name: "Topgro Finisher",
    class: "Broiler Finisher Feed",
    objective:
      "Meets nutritional requirements from approximately 28 days until slaughter.",
    feeding:
      "Feed ad lib from 32 days. Feed approximately 1250 g/bird until ~40 days. Fresh feed and water at all times.",
    texture: "Crumble or 3.2 mm Pellet",
    packaging: "10 kg and 40 kg bags",
    notes: [
      "Includes growth promoter and coccidiostat",
      "Contains at least 5% genetically modified organisms"
    ],
    nutrients: [
      { nutrient: "Protein", value: "160", bound: "Min" },
      { nutrient: "Lysine", value: "9.5", bound: "Min" },
      { nutrient: "Fat", value: "25", bound: "Min" },
      { nutrient: "Fibre", value: "70", bound: "Max" },
      { nutrient: "Calcium", value: "6 – 12", bound: "Min–Max" },
      { nutrient: "Phosphorus", value: "4.5", bound: "Min" }
    ],
    highlights: [
      "Finisher period nutrition",
      "Palatable for intake and development",
      "Digestible protein for body mass",
      "Standard growth promoter and coccidiostat"
    ]
  },
  {
    code: "P1564",
    regNo: "V16396",
    name: "Topgro Maintenance",
    class: "Broiler Maintenance Feed",
    objective:
      "Maintain weight before slaughter when desired growth has already been reached.",
    feeding: "Feed ad libitum for a maximum of 5 days. Fresh feed and water at all times.",
    texture: "Crumble or 3.2 mm Pellet",
    packaging: "10 kg and 40 kg bags",
    notes: [
      "Does not contain standard growth promoter or coccidiostat",
      "Contains at least 5% genetically modified organisms"
    ],
    nutrients: [
      { nutrient: "Protein", value: "120", bound: "Min" },
      { nutrient: "Lysine", value: "4.5", bound: "Min" },
      { nutrient: "Fat", value: "25", bound: "Min" },
      { nutrient: "Fibre", value: "90", bound: "Max" },
      { nutrient: "Calcium", value: "6 – 12", bound: "Min–Max" },
      { nutrient: "Phosphorus", value: "4.5", bound: "Min" }
    ],
    highlights: [
      "Maintains final body weight",
      "Cost saving when slaughter/sale is delayed",
      "No standard growth promoter or coccidiostat"
    ]
  }
];

/** Three-phase Topgro programme (grams per bird). */
export const threePhaseFeeding = [
  { ration: "Topgro Starter Crumbles", days: "1 – 18", gramsPerBird: 800 },
  { ration: "Topgro Grower Pellets", days: "18 – 32", gramsPerBird: 1575 },
  { ration: "Topgro Finisher Pellets", days: "32 – slaughter", gramsPerBird: 1250 }
];

/** Alternate Topgro bag recommendations by slaughter age. */
export const feedingRecommendations = {
  days35: { starterG: 800, growerG: 1200, finisherG: 1000 },
  days38: { starterG: 800, growerG: 1200, finisherG: 1600 },
  bagsPer100: {
    days35: { starter: 2, grower: 2, finisher: 2 },
    days38: { starter: 2, grower: 2, finisher: 3 }
  },
  bagsPer1000: {
    days35: { starter: 16, grower: 24, finisher: 20 },
    days38: { starter: 16, grower: 24, finisher: 32 }
  }
};

export const equipmentPer1000: {
  ageDays: number;
  chickFonts?: number;
  autoDrinkers?: number;
  scratchTrays?: number;
  feeders?: number;
}[] = [
  { ageDays: 1, chickFonts: 10, scratchTrays: 15 },
  { ageDays: 4, chickFonts: 10, autoDrinkers: 3, scratchTrays: 15, feeders: 4 },
  { ageDays: 7, chickFonts: 5, autoDrinkers: 5, feeders: 10 },
  { ageDays: 11, autoDrinkers: 6, feeders: 16 },
  { ageDays: 14, autoDrinkers: 6, feeders: 20 },
  { ageDays: 18, autoDrinkers: 8, feeders: 25 },
  { ageDays: 21, autoDrinkers: 10, feeders: 30 }
];

export const growthGuide: GrowthRow[] = [
  { week: 1, dailyGainG: 14, liveWeightG: 135, weeklyFeedG: 150, cumulativeFeedG: 150, fcr: 1.11 },
  { week: 2, dailyGainG: 31, liveWeightG: 355, weeklyFeedG: 300, cumulativeFeedG: 450, fcr: 1.27 },
  { week: 3, dailyGainG: 49, liveWeightG: 700, weeklyFeedG: 550, cumulativeFeedG: 1000, fcr: 1.43 },
  { week: 4, dailyGainG: 54, liveWeightG: 1080, weeklyFeedG: 700, cumulativeFeedG: 1700, fcr: 1.57 },
  { week: 5, dailyGainG: 57, liveWeightG: 1480, weeklyFeedG: 900, cumulativeFeedG: 2600, fcr: 1.76 },
  { week: 6, dailyGainG: 60, liveWeightG: 1900, weeklyFeedG: 1100, cumulativeFeedG: 3700, fcr: 1.95 },
  { week: 7, dailyGainG: 59, liveWeightG: 2310, weeklyFeedG: 1150, cumulativeFeedG: 4850, fcr: 2.1 },
  { week: 8, dailyGainG: 59, liveWeightG: 2720, weeklyFeedG: 1200, cumulativeFeedG: 6050, fcr: 2.22 }
];

export const pefRatings = [
  { range: "180 – 200", rating: "Poor" },
  { range: "200 – 220", rating: "Fair" },
  { range: "220 – 240", rating: "Good" },
  { range: "240 – 280", rating: "Very good" },
  { range: "> 280", rating: "Excellent" }
];

export const vaccinationExample = [
  { day: "Day-old", vaccine: "NCD oil + Hitchener B1 & IB (spray / eye drop at hatchery)" },
  { day: "Day 10", vaccine: "NCD Clone 30 (through water)" },
  { day: "Day 14", vaccine: "IBD – in drinking water" },
  { day: "Day 20 – 22", vaccine: "NCD Clone 30 (through water)" }
];

export const growthDrivers = [
  "Feed supply",
  "Light",
  "Ventilation",
  "Stocking density",
  "Nutrition",
  "Temperature",
  "Water supply",
  "Vaccinations"
] as const;

export type BroilerSectionId =
  | "overview"
  | "feeds"
  | "housing"
  | "shed"
  | "litter"
  | "rearing"
  | "feeding"
  | "lighting"
  | "ventilation"
  | "health"
  | "records"
  | "performance";

export const broilerSections: {
  id: BroilerSectionId;
  label: string;
  summary: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
    summary: "Key drivers of broiler growth, quality, and thermal balance."
  },
  {
    id: "feeds",
    label: "Feed products",
    summary: "AFGRI Broiler One Step and Topgro starter → maintenance rations."
  },
  {
    id: "housing",
    label: "Housing & equipment",
    summary: "Open-sided sheds, feeders, drinkers, nipples, and heating."
  },
  {
    id: "shed",
    label: "Shed prep",
    summary: "Clean-out, pre-heat, water, feed layout, and chick placement."
  },
  {
    id: "litter",
    label: "Litter",
    summary: "Materials, depth, moisture control, and wet-litter causes."
  },
  {
    id: "rearing",
    label: "Rearing",
    summary: "Brooding temperatures, chick checks, and stocking density."
  },
  {
    id: "feeding",
    label: "Feed & feeding",
    summary: "Storage, phases, and grams-per-bird Topgro programme."
  },
  {
    id: "lighting",
    label: "Lighting",
    summary: "Intensity and recommended light / dark schedule."
  },
  {
    id: "ventilation",
    label: "Ventilation",
    summary: "Air quality, air exchange, and winter curtain balance."
  },
  {
    id: "health",
    label: "Health & biosecurity",
    summary: "Site hygiene, vaccination example, and vaccine handling."
  },
  {
    id: "records",
    label: "Records",
    summary: "Daily and weekly flock records and batch economics."
  },
  {
    id: "performance",
    label: "Growth & PEF",
    summary: "Guideline weights, FCR, and performance efficiency factor."
  }
];

export const managementContent: Record<
  Exclude<BroilerSectionId, "feeds" | "performance">,
  { title: string; paragraphs: string[]; bullets?: string[]; callouts?: { title: string; body: string }[] }
> = {
  overview: {
    title: "Introduction",
    paragraphs: [
      "This guide gives a practical overview of broiler production. Use it with your feed technical advisor for site-specific targets, records, and profitability.",
      "Chickens are warm-blooded and keep a fairly uniform internal temperature only when ambient conditions stay within limits. House and manage birds so they can maintain thermal balance."
    ],
    bullets: [...growthDrivers],
    callouts: [
      {
        title: "Core principle",
        body: "Feed, water, temperature, light, air, space, nutrition, and vaccination all interact — manage them together, not in isolation."
      }
    ]
  },
  housing: {
    title: "Housing and equipment",
    paragraphs: [
      "Open-sided sheds remain the most common housing, with single or double-pitched roofs. Orient east–west where topography and wind allow so direct sun does not run the length of the shed. Insulate the roof and use a reflective finish.",
      "Side walls about 30–40 cm high with tops sloped to discourage perching, then mesh to the roof. Use adjustable roll-down curtains (opening from the top) and expect several adjustments per day. Space sheds at least five roof-heights apart. Each shed needs its own lidded header tank."
    ],
    bullets: [
      "Extended eaves reduce sun and rain; short grass around sheds cuts reflected heat and rodent cover",
      "Pest control: termites damage poles; rats damage insulation, pipes, and curtains",
      "Days 1–4: scratch trays or brown paper — feed on ≥25% of floor space; introduce tube feeders from day 4",
      "Feeder height: shoulder height every 2–3 days so birds stretch (less waste)",
      "Bell drinkers: base aligned with bird’s back; chick fonts low for early access",
      "Nipples: 12 birds/nipple (≈83 per 1000); height at eye level for first 5 days; activate before placement",
      "Heating: gas brooders or infra-red; derate gas brooders ~20% in open-sided houses (1000-chick unit → ~800 chicks)"
    ]
  },
  shed: {
    title: "Shed preparation",
    paragraphs: [
      "Complete preparation at least 24 hours before chicks arrive. Clean and disinfect the house, surrounds, and equipment. Spread litter 10–15 cm deep. Confirm equipment works.",
      "Pre-heat so floor under litter is 28–30°C and air at chick height is 30°C. Use a min/max thermometer. Provide clean water at room temperature — early on, water is the most critical nutrient; later birds need ~2 L water per 1 kg feed.",
      "Fill tube feeders with Topgro Starter Crumbles and scatter some on trays/paper. Do not place drinkers or feeders under brooders. Comfort zones let chicks move under heat when cold and outside the rim when hot."
    ],
    bullets: [
      "Offload chicks quickly — delay in boxes raises dehydration and early mortality",
      "Ideal brooding layout example: brooder with 2 m / 5 m / 2 m zones, 6 bell + 6 mini drinkers, 12 feed trays, 25% paper cover, automatic feeders at edges"
    ]
  },
  litter: {
    title: "Litter",
    paragraphs: [
      "Litter absorbs moisture and insulates chicks from the floor. Spread at least 10–15 cm; chicks compact it to about half in 1–2 days. Prefer untreated pine / white wood shavings (14–18% moisture, ≈550 kg per 100 m² on concrete). Sunflower husks or chopped straw are alternatives — absorbent and dust-free, free of chemicals, fungi, and wild-bird contamination.",
      "Do not reuse old litter. Store new litter under cover on site. Turn at least weekly; remove wet patches and replace with fresh shavings. Wet or caked litter causes hock burns, breast issues, and high ammonia."
    ],
    bullets: [
      "Poor ventilation / cold spots",
      "Uneven light intensity",
      "Poor feed or water distribution",
      "Diarrhoea from disease",
      "High stocking density",
      "High water pressure in drinker lines"
    ],
    callouts: [
      {
        title: "Wet litter causes",
        body: "Fix ventilation, drinker pressure, density, and disease first — litter quality follows management."
      }
    ]
  },
  rearing: {
    title: "Rearing management",
    paragraphs: [
      "Judge temperature by bird behaviour, health, and growth — not thermometers alone. Place chicks at 40–50 / m² and expand space from day 4–5.",
      "Spot brooding: day 1 under brooder 30°C at litter with house ambient 28–30°C; reduce brooder ~0.5°C/day toward ~23°C house by three weeks (guideline only in open-sided sheds).",
      "Brooding area: crumble on bases/paper covering ~25% of area; drinkers alternate with trays (~10 per 1000); one 100 W bulb per 1500 chicks initially. Brood in the house centre when possible."
    ],
    bullets: [
      "After placement: leave 1–2 hours, then check behaviour, noise, stragglers, litter, feeders/drinkers, flooding",
      "Days 2–3: reposition; add feeders/drinkers as area expands",
      "Days 5–6: reduce feed/water depth ~1.5 cm by day 14 to cut waste",
      "Never stack full chick boxes in the house; remove empties immediately",
      "Stocking: coast/hot humid 10–12 birds/m²; moderate Midlands 15–18 birds/m² — higher SD → smaller birds, more stress and back scratching"
    ],
    callouts: [
      {
        title: "Behaviour map",
        body: "Even spread under heat = just right. Huddled = too cold. Away from heat / panting = too hot. Against one side = drafty."
      }
    ]
  },
  feeding: {
    title: "Feed and feeding",
    paragraphs: [
      "After buildings, feed is the largest cost. Store bagged feed cool and dry, sealed from rodents, insects, and wild birds; stack on pallets off walls. Rotate stock. Bulk bins need sealing lids and frequent clean-outs. Avoid spillage and overfilling.",
      "Choose regimes by slaughter weight/age, yield, carcass quality, skin colour, and sex-separate feeding. Two methods: feed to age (regardless of amount) or feed to kilograms of each ration until finished."
    ],
    callouts: [
      {
        title: "Measure everything",
        body: "Whichever method you use, measure accurately and calculate the economic result for your site."
      }
    ]
  },
  lighting: {
    title: "Lighting",
    paragraphs: [
      "High intensity for the first 3–4 days drives early activity and even growth. Maintain ~20–30 lux from day-old to ~14 days (e.g. two 40 W globes 2 m high in a 3×3 m room), then reduce toward ~10 lux based on behaviour."
    ],
    bullets: [
      "Day 1: 23 hours light / 1 hour dark",
      "Day 2 onwards: 16 hours light / 8 hours dark"
    ]
  },
  ventilation: {
    title: "Ventilation",
    paragraphs: [
      "Fresh air must circulate evenly at bird level. Growing birds produce dust, ammonia, CO, CO₂, and water vapour that damage lungs, cut intake, and hurt growth. High humidity above ~30°C slows cooling and growth.",
      "Replace shed air about once per minute (open-sided or controlled). Use fixed or moveable fans carefully — avoid chilling drafts and dead spots. In winter, balance opening curtains for fresh air against chilling chicks. Minimum ventilation during brooding is critical."
    ]
  },
  health: {
    title: "Health control and biosecurity",
    paragraphs: [
      "Prefer all-in/all-out, single age per shed. Limit staff movement between sites/houses; restrict vehicles; minimise age spread; run pest control. Depopulate, downtime, clean, and disinfect sheds and equipment. Dispose of mortalities promptly (sealed mortality pit). Rotate disinfectants ~every 6 months; ensure efficacy against IBD (Gumboro) at correct dilution.",
      "Vaccination programmes are site-specific — consult a poultry vet. Cover Newcastle Disease, Infectious Bronchitis, and IBD. Ensure hatchery primary vaccination so on-farm doses boost immunity.",
      "Watch feed, water, behaviour, and mortality daily; discuss deviations with your TA or vet."
    ],
    bullets: [
      "Keep vaccine cool (not frozen), at the back of the fridge, out of sunlight",
      "Open bottles under water; rotate stock for freshness",
      "Spray: dim lights, herd calmly, early morning; spray ~45 cm above heads; use sterile distilled water",
      "Water: remove drinkers 1 hour before; 25 g skim milk powder per 10 L to neutralise chlorine; consume vaccine within ~30 minutes"
    ]
  },
  records: {
    title: "Records",
    paragraphs: [
      "Keep records as a live management tool against targets. Batch header: batch number, farm/site, house, chicks placed, parent flock and age, hatch date, hatchery, breed, day-old vaccination, weight per 100 day-olds, dead-in-box.",
      "Daily: feed, water, mortality, min/max temperatures, vaccinations, deliveries (feed, gas, litter), gas used. Weekly: body weights and uniformity, cumulative mortality.",
      "At sale/slaughter calculate FCR and PEF with your TA, and batch expenses vs income (chicks, feed, gas, shavings, labour, vaccinations, disinfectant, electricity, water, medication, transport, sales, manure)."
    ]
  }
};

export function calcFcr(totalFeedKg: number, totalLiveWeightKg: number) {
  if (!totalLiveWeightKg) return null;
  return totalFeedKg / totalLiveWeightKg;
}

/** PEF = survivability% × avg weight (kg) × 100 / (avg age days × FCR) */
export function calcPef(opts: {
  survivabilityPct: number;
  avgWeightKg: number;
  avgAgeDays: number;
  fcr: number;
}) {
  if (!opts.avgAgeDays || !opts.fcr) return null;
  return (opts.survivabilityPct * opts.avgWeightKg * 100) / (opts.avgAgeDays * opts.fcr);
}

export function pefRatingLabel(pef: number) {
  if (pef > 280) return "Excellent";
  if (pef >= 240) return "Very good";
  if (pef >= 220) return "Good";
  if (pef >= 200) return "Fair";
  return "Poor";
}
