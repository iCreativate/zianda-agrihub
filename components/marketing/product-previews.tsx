import { BrandMark } from "@/components/ui/brand-mark";

export function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-card border border-stone bg-ivory shadow-lift">
      <div className="flex items-center justify-between border-b border-stone bg-paper px-4 py-3">
        <div className="flex items-center gap-2">
          <BrandMark size="sm" />
          <div>
            <p className="text-[11px] font-semibold tracking-tight">Zianda Agri-Hub</p>
            <p className="text-[10px] text-ink-subtle">Farm overview</p>
          </div>
        </div>
        <span className="badge-wheat">Live</span>
      </div>
      <div className="grid grid-cols-3 gap-px bg-stone">
        <Metric label="Assets" value="128" note="Herd + blocks" />
        <Metric label="Vaccines due" value="7" note="Next 30 days" accent />
        <Metric label="Burn" value="R 42k" note="Projected +20%" />
      </div>
      <div className="space-y-2 bg-paper p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">
          Vaccination calendar
        </p>
        <PreviewRow date="Thu 21 Aug" title="Brucellosis" meta="Nguni heifer · Tag 104" />
        <PreviewRow date="Mon 25 Aug" title="Anthrax" meta="Boran steer · Tag 088" />
        <PreviewRow date="Fri 29 Aug" title="Clostridial 5-in-1" meta="Dorper ewes · Camp 3" />
      </div>
    </div>
  );
}

function Metric(props: { label: string; value: string; note: string; accent?: boolean }) {
  return (
    <div className="bg-paper px-3 py-4">
      <p className="text-[10px] uppercase tracking-wider text-ink-subtle">{props.label}</p>
      <p className={`mt-1 text-xl font-semibold tracking-tight ${props.accent ? "text-clay" : "text-ink"}`}>
        {props.value}
      </p>
      <p className="mt-0.5 text-[10px] text-ink-subtle">{props.note}</p>
    </div>
  );
}

function PreviewRow(props: { date: string; title: string; meta: string }) {
  return (
    <div className="rounded-control border border-stone bg-ivory px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">{props.date}</p>
      <p className="text-[12px] font-medium">{props.title}</p>
      <p className="text-[11px] text-ink-subtle">{props.meta}</p>
    </div>
  );
}

export function LivestockPreview() {
  return (
    <div className="surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">Animals (3)</p>
      <div className="mt-3 divide-y divide-stone">
        <AnimalRow initials="NG" name="Nguni 104" meta="Cattle · heifer · 318 kg" />
        <AnimalRow initials="BO" name="Boran 088" meta="Cattle · steer · ID: BR-088" />
        <AnimalRow initials="DR" name="Dorper camp 3" meta="Sheep · 42 ewes" />
      </div>
    </div>
  );
}

function AnimalRow(props: { initials: string; name: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone text-[10px] font-semibold">
        {props.initials}
      </div>
      <div>
        <p className="text-sm font-medium">{props.name}</p>
        <p className="text-xs text-ink-subtle">{props.meta}</p>
      </div>
    </div>
  );
}

export function CropsPreview() {
  return (
    <div className="surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">Crop blocks</p>
      <div className="mt-3 space-y-2">
        <div className="rounded-control border border-stone bg-ivory px-3 py-2">
          <p className="text-sm font-medium">Block M-12 · Maize</p>
          <p className="text-xs text-ink-subtle">Planted 12 Oct · 18.4 ha · soil logged</p>
        </div>
        <div className="rounded-control border border-stone bg-ivory px-3 py-2">
          <p className="text-sm font-medium">Block W-04 · Wheat</p>
          <p className="text-xs text-ink-subtle">Free State · 11.0 ha · irrigation due</p>
        </div>
      </div>
    </div>
  );
}

export function FinancePreview() {
  return (
    <div className="surface p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">This month</p>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-xs text-ink-subtle">Burn</p>
          <p className="text-2xl font-semibold tracking-tight">R 42,180</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-subtle">Projected yield</p>
          <p className="text-lg font-semibold text-crop">R 50,616</p>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ivory-deep">
        <div className="h-full w-2/3 rounded-full bg-ink" />
      </div>
      <p className="mt-3 text-xs text-ink-muted">Feed, labour and medical linked to herd and fields.</p>
    </div>
  );
}

export function HealthPreview() {
  return (
    <div className="surface p-4">
      <p className="section-eyebrow">Health card</p>
      <p className="mt-2 text-sm font-semibold">Nguni 104</p>
      <p className="text-xs text-ink-muted">Cattle · Nguni · Tag 104</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-control bg-ivory px-2 py-2">
          <p className="text-[10px] uppercase text-ink-subtle">Next vaccine</p>
          <p className="font-medium">Brucellosis</p>
        </div>
        <div className="rounded-control bg-ivory px-2 py-2">
          <p className="text-[10px] uppercase text-ink-subtle">Weight</p>
          <p className="font-medium">318 kg</p>
        </div>
      </div>
    </div>
  );
}

export function ScanPreview() {
  return (
    <div className="surface p-4">
      <p className="text-sm font-semibold">Scan health card</p>
      <p className="mt-1 text-xs text-ink-muted">Enter an animal or block ID, or photograph the QR tag.</p>
      <div className="mt-3 rounded-control border border-stone bg-ivory px-3 py-2 text-xs text-ink-subtle">
        e.g. L-104 or B-Maize-12
      </div>
      <div className="btn-primary mt-3 w-full text-xs">View health card</div>
    </div>
  );
}

export function ReportPreview() {
  return (
    <div className="surface p-4">
      <p className="text-sm font-semibold">Audit & investor report</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        Herd overview, vaccination compliance, monthly burn and crop records in one PDF.
      </p>
      <div className="btn-secondary mt-3 text-xs">Generate report</div>
    </div>
  );
}

export function OfflinePreview() {
  return (
    <div className="surface p-4">
      <p className="text-sm font-semibold">Works in the lands</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        Capture animals, treatments and costs offline. Records sync when signal returns.
      </p>
      <span className="badge-crop mt-3">Offline ready</span>
    </div>
  );
}
