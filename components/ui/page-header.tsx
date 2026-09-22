import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        props.className
      )}
    >
      <div className="max-w-2xl">
        {props.eyebrow && <p className="section-eyebrow mb-3">{props.eyebrow}</p>}
        <h1 className="page-title">{props.title}</h1>
        {props.description && <p className="page-lede">{props.description}</p>}
      </div>
      {props.actions && (
        <div className="flex flex-wrap items-center gap-2">{props.actions}</div>
      )}
    </div>
  );
}
