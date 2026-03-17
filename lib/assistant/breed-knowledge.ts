interface BreedKnowledge {
  heading: string;
  summary: string;
  points: string[];
}

function normalise(value: string | undefined): string {
  return (value ?? "").toLowerCase();
}

function cattleKnowledge(breed: string | undefined): BreedKnowledge {
  const b = normalise(breed);

  if (b.includes("holstein") || b.includes("jersey") || b.includes("dairy")) {
    return {
      heading: "Dairy cattle care focus",
      summary:
        "Dairy breeds convert feed into milk rather than meat. They need steady energy, clean housing and strong udder and hoof care to stay productive.",
      points: [
        "Keep a consistent feeding routine with enough roughage and clean water to support milk production.",
        "Prioritise udder health: clean milking routines, dry teats after milking, and watch closely for mastitis.",
        "Maintain good footing and hoof trimming to reduce lameness, as lame cows eat less and give less milk.",
        "Protect body condition around calving and early lactation; cows that lose too much weight will struggle to fall pregnant again.",
      ],
    };
  }

  if (b.includes("brahman") || b.includes("boran") || b.includes("nguni") || b.includes("beef")) {
    return {
      heading: "Beef cattle care focus",
      summary:
        "Beef breeds are managed for growth and body condition. They often cope well with heat and ticks, but still need planned nutrition and health care to reach target weights.",
      points: [
        "Match stocking rate to grazing capacity so animals keep gaining weight instead of slowly losing condition.",
        "Use strategic deworming and tick control based on faecal egg counts and local vet guidance.",
        "Group animals by age and class (weaners, heifers, cows, bulls) so each group gets the right feed.",
        "Record weights or body condition scores regularly to see which animals are performing and which need attention.",
      ],
    };
  }

  return {
    heading: "General cattle care focus",
    summary:
      "Healthy cattle need clean water, balanced feed, strong parasite control and calm handling. Good records make it easier to spot problems early.",
    points: [
      "Provide shade and reliable, clean water points in every camp, especially in hot months.",
      "Handle cattle calmly and avoid overcrowded crushes to reduce stress and injuries.",
      "Work with your vet to design a vaccination and parasite plan that fits your area and production system.",
      "Keep simple records: births, deaths, purchases, sales, treatments and movements for each group or animal.",
    ],
  };
}

function goatKnowledge(breed: string | undefined): BreedKnowledge {
  const b = normalise(breed);

  if (b.includes("boer") || b.includes("kalahari")) {
    return {
      heading: "Meat goat care focus",
      summary:
        "Meat goats like Boer and Kalahari Red are hardy but need good parasite control, mineral support and strong kid management to reach target weights.",
      points: [
        "Plan kidding seasons so kids arrive in a period with good grazing and shelter from wind and rain.",
        "Use regular faecal egg counts where possible and rotate camps to reduce internal parasite pressure.",
        "Provide a high-quality mineral lick formulated for goats and keep plenty of clean water available.",
        "Trim hooves and inspect feet often, especially in wet periods, to prevent foot-rot and lameness.",
      ],
    };
  }

  return {
    heading: "General goat care focus",
    summary:
      "Goats are curious and selective grazers. They thrive with browse, dry shelter, strong parasite control and close kid monitoring.",
    points: [
      "Provide dry, draft-free night housing and protect kids from cold, wet conditions.",
      "Offer access to shrubs or browse where possible; goats prefer mixed diets over only short grass.",
      "Keep fences and camps secure; goats explore and will test weak spots regularly.",
      "Watch body condition and hair coat; sudden changes can signal worms, poor nutrition or disease.",
    ],
  };
}

function genericLivestockKnowledge(): BreedKnowledge {
  return {
    heading: "General livestock care focus",
    summary:
      "Whatever the species, healthy animals need clean water, balanced feed, low stress and simple, consistent routines. Good basics prevent many common problems.",
    points: [
      "Check animals at least once a day for changes in appetite, movement, breathing or behaviour.",
      "Provide enough clean, fresh water and shade in every camp, especially in hot or dry seasons.",
      "Work with your vet to design a vaccination and parasite plan that fits your area and production system.",
      "Keep basic records of births, deaths, purchases, sales and treatments so you can see trends over time.",
    ],
  };
}

export function getBreedKnowledge(species: string | undefined, breed: string | undefined): BreedKnowledge | null {
  const s = normalise(species);
  if (!s) return null;

  if (s === "cattle") {
    return cattleKnowledge(breed);
  }

  if (s === "goat") {
    return goatKnowledge(breed);
  }

  // Only show generic guidance when the farmer explicitly chose "other" or left breed very open.
  // For specific species like sheep, pigs, poultry, dogs etc. we prefer no panel to avoid inaccurate advice.
  if (s === "other") {
    return genericLivestockKnowledge();
  }

  return null;
}

