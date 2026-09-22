"use client";

import { AnimalProfile } from "@/components/livestock/animal-profile";

interface LivestockDetailPageProps {
  params: { id: string };
}

export default function LivestockDetailPage({ params }: LivestockDetailPageProps) {
  return <AnimalProfile id={params.id} />;
}
