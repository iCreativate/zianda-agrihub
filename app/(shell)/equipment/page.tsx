"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Cog, Plus, Truck, Wrench } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";
import { useLocalRegisterCount, useLocalRegisterItems } from "@/lib/farm/use-local-register";
import { useTransactions } from "@/lib/supabase/hooks";
import { formatMoney } from "@/lib/format";

type NamedItem = {
  id: string;
  name?: string;
  type?: string;
  make?: string;
  model?: string;
  makeModel?: string;
};

export default function EquipmentPage() {
  const plantCount = useLocalRegisterCount("zianda_plant_machinery");
  const motorCount = useLocalRegisterCount("zianda_motor_vehicles");
  const toolsCount = useLocalRegisterCount("zianda_tools");
  const plant = useLocalRegisterItems<NamedItem>("zianda_plant_machinery");
  const motor = useLocalRegisterItems<NamedItem>("zianda_motor_vehicles");
  const tools = useLocalRegisterItems<NamedItem>("zianda_tools");
  const transactions = useTransactions();

  const equipmentSpend = useMemo(() => {
    return (transactions.data ?? [])
      .filter((row) => row.category === "equipment")
      .reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0);
  }, [transactions.data]);

  const recent = [
    ...plant.slice(0, 3).map((item) => ({
      href: `/plant-machinery/${item.id}`,
      title: item.name || item.type || "Plant item",
      note: "Plant & machinery"
    })),
    ...motor.slice(0, 3).map((item) => ({
      href: `/motor/${item.id}`,
      title:
        item.name ||
        item.makeModel ||
        [item.make, item.model].filter(Boolean).join(" ") ||
        "Vehicle",
      note: "Motor"
    })),
    ...tools.slice(0, 3).map((item) => ({
      href: `/tools/${item.id}`,
      title: item.name || item.type || "Tool",
      note: "Tools"
    }))
  ].slice(0, 6);

  const modules = [
    {
      href: "/plant-machinery",
      icon: Cog,
      title: "Plant and machinery",
      note: "Implements, maintenance, and workshop records.",
      count: plantCount,
      addHref: "/plant-machinery/new"
    },
    {
      href: "/motor",
      icon: Truck,
      title: "Motor (vehicles)",
      note: "Tractors, bakkies, and agricultural vehicles.",
      count: motorCount,
      addHref: "/motor/new"
    },
    {
      href: "/tools",
      icon: Wrench,
      title: "Tools",
      note: "Hand tools, power tools, and field kits.",
      count: toolsCount,
      addHref: "/tools/new"
    }
  ];

  return (
    <AppPage
      hero={
        <PageHero
          eyebrow="Yard"
          title="Equipment"
          description="Plant, vehicles, and tools in one place. Open a register to add or update an asset."
          image="/images/home/machinery.jpg"
          imageAlt="Farm machinery in the field"
          asideTitle="Registers"
          asideNote="Keep plant, motor, and tools current so maintenance and costs stay linked."
          actions={
            <Link href="/plant-machinery/new" className="btn-primary min-h-12">
              <Plus className="h-4 w-4" />
              Add asset
            </Link>
          }
        />
      }
    >
      <section className="grid gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Plant & machinery" value={String(plantCount)} />
        <Metric label="Vehicles" value={String(motorCount)} />
        <Metric label="Tools" value={String(toolsCount)} />
        <Metric
          label="Equipment spend"
          value={transactions.isLoading ? "—" : formatMoney(equipmentSpend)}
          note="From finance records"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {modules.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.href} className="surface p-6">
              <Icon className="h-5 w-5 text-ink-subtle" />
              <p className="mt-4 text-lg font-semibold tracking-tight">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.note}</p>
              <p className="mt-4 text-2xl font-semibold tabular-nums">{item.count}</p>
              <p className="text-xs text-ink-subtle">on register</p>
              <div className="mt-5 flex gap-2">
                <Link href={item.href} className="btn-secondary flex-1">
                  Open
                </Link>
                <Link href={item.addHref} className="btn-primary flex-1">
                  Add
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      <section className="surface p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold tracking-tight">Recent yard assets</h2>
          <Link href="/finances/categories" className="link-quiet">
            Equipment costs
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No plant, vehicles or tools recorded yet. Add the first asset from a register above.
          </p>
        ) : (
          <div className="divide-y divide-stone">
            {recent.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center justify-between gap-3 py-3"
              >
                <span>
                  <span className="block text-sm font-medium text-ink">{item.title}</span>
                  <span className="block text-xs text-ink-subtle">{item.note}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AppPage>
  );
}

function Metric(props: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-paper px-4 py-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">{props.label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{props.value}</p>
      {props.note && <p className="mt-1 text-xs text-ink-subtle">{props.note}</p>}
    </div>
  );
}
