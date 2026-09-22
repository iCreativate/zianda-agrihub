import { QRCodeCanvas } from "qrcode.react";
import type { Livestock, VegetationBlock, HealthTimelinePhoto } from "@/types/agriculture";

type HealthCardAsset = Livestock | VegetationBlock;

interface HealthCardProps {
  asset: HealthCardAsset;
  photos?: HealthTimelinePhoto[];
}

function isLivestock(asset: HealthCardAsset): asset is Livestock {
  return (asset as Livestock).species !== undefined;
}

export function HealthCard(props: HealthCardProps) {
  const { asset, photos } = props;
  const title = isLivestock(asset)
    ? asset.name || asset.externalId
    : asset.cropType.toString().toUpperCase();

  const subtitle = isLivestock(asset)
    ? `${asset.species}${asset.breed ? ` · ${asset.breed}` : ""}`
    : asset.variety ?? "Crop block";

  const qrValue = asset.qrCode ?? asset.externalId ?? asset.id;

  return (
    <section className="flex flex-col gap-5 surface p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="section-eyebrow">Health card</p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-xs text-ink-muted">{subtitle}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-control border border-stone bg-paper p-1.5">
            <QRCodeCanvas value={qrValue} size={80} className="rounded-md" />
          </div>
          <p className="text-[10px] text-ink-subtle">Scan for full history</p>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
        {isLivestock(asset) ? (
          <>
            <InfoItem label="ID" value={asset.externalId} />
            <InfoItem label="DOB" value={asset.dateOfBirth} />
            <InfoItem
              label="Weight"
              value={asset.weightKg ? `${asset.weightKg.toFixed(1)} kg` : undefined}
            />
            <InfoItem
              label="Vaccinations"
              value={
                asset.vaccinationHistory?.length
                  ? `${asset.vaccinationHistory.length} records`
                  : "None"
              }
            />
          </>
        ) : (
          <>
            <InfoItem label="Block ID" value={asset.externalId} />
            <InfoItem label="Planting date" value={asset.plantingDate} />
            <InfoItem
              label="Area"
              value={asset.areaHectares ? `${asset.areaHectares} ha` : undefined}
            />
            <InfoItem
              label="Schedules"
              value={
                asset.inputSchedule?.length
                  ? `${asset.inputSchedule.length} items`
                  : "None"
              }
            />
          </>
        )}
      </dl>

      {photos && photos.length > 0 && (
        <div className="mt-1 space-y-2">
          <p className="text-xs font-medium">Symptom & recovery timeline</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {photos.map((photo) => (
              <figure
                key={photo.id}
                className="min-w-[96px] rounded-control border border-stone bg-ivory p-1.5 text-[10px]"
              >
                    <div className="aspect-square w-full overflow-hidden rounded-md bg-stone">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.photoUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                <figcaption className="mt-1 text-ink-subtle">
                  {new Date(photo.capturedAt).toLocaleDateString()}
                  {photo.notes ? ` · ${photo.notes}` : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface InfoItemProps {
  label: string;
  value?: string | number;
}

function InfoItem(props: InfoItemProps) {
  if (!props.value) return null;
  return (
    <div className="rounded-control border border-stone bg-ivory px-3 py-2">
      <dt className="text-[10px] font-medium uppercase tracking-wide text-ink-subtle">
        {props.label}
      </dt>
      <dd className="mt-0.5 text-xs font-medium">{props.value}</dd>
    </div>
  );
}
