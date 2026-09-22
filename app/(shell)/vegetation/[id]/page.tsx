"use client";

import { FieldDetail } from "@/components/crops/field-detail";

interface VegetationDetailPageProps {
  params: { id: string };
}

export default function VegetationDetailPage({ params }: VegetationDetailPageProps) {
  return <FieldDetail id={params.id} />;
}
