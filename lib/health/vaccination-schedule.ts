import type { Livestock, VaccinationScheduleItem } from "@/types/agriculture";

interface Template {
  vaccineName: string;
  ageDays: number;
}

const cattleTemplate: Template[] = [
  { vaccineName: "Brucellosis", ageDays: 90 },
  { vaccineName: "Anthrax", ageDays: 180 }
];

const goatTemplate: Template[] = [
  { vaccineName: "Clostridial 7-in-1", ageDays: 60 },
  { vaccineName: "Pulpy kidney booster", ageDays: 120 }
];

export function buildVaccinationScheduleForCalf(livestock: Livestock): VaccinationScheduleItem[] {
  if (!livestock.dateOfBirth) return [];

  let templates: Template[] = [];
  if (livestock.species === "cattle") {
    templates = cattleTemplate;
  } else if (livestock.species === "goat") {
    templates = goatTemplate;
  }

  if (templates.length === 0) return [];

  const dob = new Date(livestock.dateOfBirth);

  return templates.map((template) => {
    const scheduled = new Date(dob);
    scheduled.setDate(scheduled.getDate() + template.ageDays);
    return {
      id: `${livestock.id}-${template.vaccineName}`,
      livestockId: livestock.id,
      vaccineName: template.vaccineName,
      recommendedAgeDays: template.ageDays,
      scheduledDate: scheduled.toISOString().slice(0, 10),
      completed: false
    };
  });
}

