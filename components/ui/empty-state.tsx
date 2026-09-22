import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  image?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
}

export function EmptyState(props: EmptyStateProps) {
  return (
    <div className={cn("empty-state", props.className)}>
      {props.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={props.image}
          alt=""
          className="mx-auto h-32 w-full max-w-xs rounded-control object-cover opacity-90"
        />
      ) : (
        props.icon && (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-control bg-ivory-deep text-ink-subtle">
            {props.icon}
          </div>
        )
      )}
      <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">{props.title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
        {props.description}
      </p>
      {props.actions && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {props.actions}
        </div>
      )}
    </div>
  );
}
