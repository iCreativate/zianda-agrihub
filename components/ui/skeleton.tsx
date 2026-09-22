import { cn } from "@/lib/utils";

export function Skeleton(props: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-control bg-stone/60", props.className)}
      aria-hidden
    />
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card bg-paper">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
