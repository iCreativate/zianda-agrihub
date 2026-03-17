export type AssetKind = "livestock" | "crop" | "equipment";

export interface CareContext {
  kind: AssetKind;
  species?: string; // e.g. "beef_cattle", "dairy_cattle", "goat"
  ageDays?: number; // for animals
  cropType?: string; // e.g. "maize", "wheat", "vegetables"
  stage?: string; // e.g. "seedling", "flowering", "finishing"
  equipmentType?: string; // e.g. "tractor", "sprayer"
  locationClimate?: string;
}

export interface CareRecommendation {
  id: string;
  title: string;
  body: string;
  priority: "high" | "normal" | "info";
  tags: string[];
}

function base(id: string, title: string, body: string, priority: CareRecommendation["priority"], tags: string[]): CareRecommendation {
  return { id, title, body, priority, tags };
}

function cattleRecommendations(ctx: CareContext): CareRecommendation[] {
  const recs: CareRecommendation[] = [];
  const age = ctx.ageDays ?? null;

  // Newborn to 7 days
  if (age !== null && age <= 7) {
    recs.push(
      base(
        "cattle-newborn-colostrum",
        "Colostrum and early life care",
        "Make sure this calf received enough colostrum within the first 6 hours of life. Keep mother and calf in a clean, dry pen away from mud and wind. Watch for scours (diarrhoea) and weakness.",
        "high",
        ["health", "calf", "hygiene"]
      )
    );
  }

  // 1–6 months
  if (age !== null && age > 7 && age <= 180) {
    recs.push(
      base(
        "cattle-young-vaccines",
        "Plan core vaccines for young cattle",
        "Work with your vet to schedule Brucellosis, Anthrax and Clostridial vaccines according to your country guidelines. Make sure dates are captured in Zianda so reminders stay up to date.",
        "high",
        ["vaccination", "planning"]
      )
    );
    recs.push(
      base(
        "cattle-weaning-nutrition",
        "Support weaning and growth",
        "Avoid sudden feed changes. Introduce good quality forage and a balanced lick or concentrate. Provide clean water at all times and monitor weight gains monthly.",
        "normal",
        ["nutrition", "growth"]
      )
    );
  }

  // Any age – general
  recs.push(
    base(
      "cattle-parasites",
      "Control internal and external parasites",
      "Check body condition, coat and dung regularly. Deworm and dip or spray based on vet advice and local parasite pressure rather than on a fixed calendar only.",
      "normal",
      ["parasites", "routine"]
    )
  );

  recs.push(
    base(
      "cattle-records",
      "Keep animal records up to date",
      "Keep this animal's date of birth, tag number, treatments and movements updated in Zianda. Good records make it easier to prove health status to buyers and inspectors.",
      "info",
      ["records"]
    )
  );

  return recs;
}

function goatRecommendations(ctx: CareContext): CareRecommendation[] {
  const recs: CareRecommendation[] = [];
  const age = ctx.ageDays ?? null;

  if (age !== null && age <= 30) {
    recs.push(
      base(
        "goat-kid-care",
        "Kid care and housing",
        "Keep kids in a dry, draft-free shelter at night and during rain. Make sure they suckle well and monitor navels for infection. Provide a small creep area where kids can access starter feed.",
        "high",
        ["housing", "kid", "health"]
      )
    );
  }

  recs.push(
    base(
      "goat-feet",
      "Hoof and foot health",
      "Trim hooves regularly to prevent lameness, especially in wet seasons. Walk animals through dry areas after grazing on wet pasture to reduce foot problems.",
      "normal",
      ["feet", "lameness"]
    )
  );

  recs.push(
    base(
      "goat-minerals",
      "Provide minerals and clean water",
      "Offer a suitable mineral lick formulated for goats and make sure clean water is always available. Avoid sharing cattle-only licks if they contain copper levels unsafe for goats.",
      "normal",
      ["nutrition"]
    )
  );

  return recs;
}

function maizeRecommendations(ctx: CareContext): CareRecommendation[] {
  const recs: CareRecommendation[] = [];
  const stage = (ctx.stage ?? "").toLowerCase();

  if (stage.includes("seedling")) {
    recs.push(
      base(
        "maize-seedling-stand",
        "Check germination and plant stand",
        "Walk the block and look for patchy emergence, waterlogging or insect damage on seedlings. Replant poor patches early before the crop canopy closes.",
        "high",
        ["scouting", "establishment"]
      )
    );
    recs.push(
      base(
        "maize-seedling-weeds",
        "Early weed control",
        "Control weeds early so they do not compete for moisture and nutrients. Use mechanical or chemical control following label and safety instructions.",
        "normal",
        ["weeds"]
      )
    );
  } else if (stage.includes("flower") || stage.includes("tassel") || stage.includes("silk")) {
    recs.push(
      base(
        "maize-tasselling-water",
        "Protect moisture at tasselling and silking",
        "Maize is very sensitive to water stress at tasselling and silking. Prioritise irrigation or soil moisture conservation in this period to protect yield.",
        "high",
        ["water", "yield"]
      )
    );
    recs.push(
      base(
        "maize-tasselling-pests",
        "Scout for cob and foliar pests",
        "Scout for stalk borers, earworms and fungal disease on leaves and cobs. Treat only when pest levels justify it, following integrated pest management principles.",
        "normal",
        ["pests", "disease"]
      )
    );
  } else if (stage.includes("finishing") || stage.includes("maturity")) {
    recs.push(
      base(
        "maize-harvest-readiness",
        "Plan harvest and storage",
        "Check grain moisture and plan harvest timing to avoid losses from lodging or mould. Prepare clean, dry storage and fumigation plans if needed.",
        "normal",
        ["harvest", "storage"]
      )
    );
  }

  // General maize advice
  recs.push(
    base(
      "maize-rotation",
      "Use rotation to manage soil and pests",
      "Rotate maize with legumes or other crops to improve soil structure, reduce disease build-up and spread labour and risk across the season.",
      "info",
      ["rotation", "soil"]
    )
  );

  return recs;
}

function equipmentRecommendations(ctx: CareContext): CareRecommendation[] {
  const recs: CareRecommendation[] = [];
  const type = (ctx.equipmentType ?? "").toLowerCase();

  if (type.includes("tractor")) {
    recs.push(
      base(
        "tractor-service",
        "Service and safety checks",
        "Follow the manufacturer service intervals for oil, filters and coolant. Check tyres, lights, brakes and PTO guards before heavy work and record hours in Zianda.",
        "high",
        ["maintenance", "safety"]
      )
    );
  } else if (type.includes("sprayer")) {
    recs.push(
      base(
        "sprayer-calibration",
        "Calibrate sprayer and protect operators",
        "Calibrate nozzles and pressure regularly so application rates match the label. Make sure operators wear the correct PPE and mix products safely away from water sources.",
        "high",
        ["sprayer", "safety"]
      )
    );
  }

  recs.push(
    base(
      "equipment-storage",
      "Clean and store equipment correctly",
      "After use, clean mud and crop residues, grease moving parts and store under cover where possible. This reduces breakdowns and extends machine life.",
      "normal",
      ["storage", "maintenance"]
    )
  );

  return recs;
}

export function getCareRecommendations(ctx: CareContext): CareRecommendation[] {
  const kind = ctx.kind;
  const species = (ctx.species ?? "").toLowerCase();
  const cropType = (ctx.cropType ?? "").toLowerCase();

  if (kind === "livestock") {
    if (species.includes("cattle") || species.includes("beef") || species.includes("dairy")) {
      return cattleRecommendations(ctx);
    }
    if (species.includes("goat") || species.includes("caprine")) {
      return goatRecommendations(ctx);
    }
  }

  if (kind === "crop") {
    if (cropType.includes("maize") || cropType.includes("corn")) {
      return maizeRecommendations(ctx);
    }
  }

  if (kind === "equipment") {
    return equipmentRecommendations(ctx);
  }

  // Fallback: generic record-keeping recommendation
  return [
    base(
      "generic-records",
      "Keep this record up to date",
      "Capture dates, treatments and key notes for this asset so Zianda Agri-Hub can give better reminders and reports.",
      "info",
      ["records"]
    ),
  ];
}

