import { AppPage } from "@/components/shell/app-page";
import { SubPageBanner } from "@/components/ui/sub-page-banner";

type FormPageProps = {
  backHref: string;
  backLabel: string;
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  actions?: React.ReactNode;
  contentClassName?: string;
  children: React.ReactNode;
};

export function FormPage(props: FormPageProps) {
  return (
    <AppPage
      contentClassName={props.contentClassName}
      hero={
        <SubPageBanner
          backHref={props.backHref}
          backLabel={props.backLabel}
          eyebrow={props.eyebrow}
          title={props.title}
          description={props.description}
          image={props.image}
          imageAlt={props.imageAlt}
          actions={props.actions}
        />
      }
    >
      {props.children}
    </AppPage>
  );
}
