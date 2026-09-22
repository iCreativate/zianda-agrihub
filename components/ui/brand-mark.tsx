import { cn } from "@/lib/utils";

export function BrandMark(props: { className?: string; size?: "sm" | "md" }) {
  const size = props.size ?? "md";

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-ink font-semibold text-paper",
        size === "sm" ? "h-8 w-8 rounded-lg text-[11px]" : "h-10 w-10 rounded-[10px] text-sm",
        props.className
      )}
      aria-hidden
    >
      ZA
    </div>
  );
}
