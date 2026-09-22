import { cn } from "@/lib/utils";

type AppPageProps = {
  hero?: React.ReactNode;
  children: React.ReactNode;
  bleed?: boolean;
  className?: string;
  contentClassName?: string;
};

/**
 * Standard authenticated page shell — full-bleed cinematic hero + constrained content.
 */
export function AppPage(props: AppPageProps) {
  const bleed = props.bleed ?? true;

  return (
    <div className={cn("command-centre pb-6", props.className)}>
      {props.hero ? (
        <div
          className={cn(
            bleed &&
              "-mx-4 overflow-hidden md:-mx-6 lg:-mx-8 lg:rounded-b-card"
          )}
        >
          {props.hero}
        </div>
      ) : null}

      <div
        className={cn(
          "mx-auto max-w-[1200px] space-y-8 md:space-y-10",
          props.hero ? "mt-8 md:mt-10" : undefined,
          props.contentClassName
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
