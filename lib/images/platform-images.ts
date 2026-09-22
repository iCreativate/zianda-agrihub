/**
 * Platform marketing and hero imagery — all AI-generated.
 * See public/images/home/README.md
 */
export const PLATFORM_IMAGES = {
  hero: { src: "/images/home/hero.jpg", alt: "AI-generated savanna sunset with cattle" },
  aerial: { src: "/images/home/aerial.jpg", alt: "AI-generated aerial view of farmland" },
  livestock: { src: "/images/home/livestock.jpg", alt: "AI-generated cattle grazing on grassland" },
  crops: { src: "/images/home/crops.jpg", alt: "AI-generated maize crop field" },
  grain: { src: "/images/home/grain.jpg", alt: "AI-generated harvested grain" },
  vegetables: { src: "/images/home/vegetables.jpg", alt: "AI-generated vegetable farm plots" },
  farmer: { src: "/images/home/farmer.jpg", alt: "AI-generated farmer in a crop field" },
  qr: { src: "/images/home/qr.jpg", alt: "AI-generated QR scanning on a farm" },
  health: { src: "/images/home/health.jpg", alt: "AI-generated livestock health scene" },
  finances: { src: "/images/home/finances.jpg", alt: "AI-generated farm harvest operations" },
  machinery: { src: "/images/home/machinery.jpg", alt: "AI-generated agricultural machinery" },
  reports: { src: "/images/home/reports.jpg", alt: "AI-generated farm landscape at sunset" },
  offline: { src: "/images/home/offline.jpg", alt: "AI-generated farmer using a phone in the field" },
  sheep: { src: "/images/home/sheep.jpg", alt: "AI-generated sheep on grassland" }
} as const;

export type PlatformImageKey = keyof typeof PLATFORM_IMAGES;

export function platformImage(key: PlatformImageKey) {
  return PLATFORM_IMAGES[key];
}
