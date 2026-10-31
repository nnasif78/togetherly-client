import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type PageHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  action?: ReactNode;
};

export default function PageHeading({ eyebrow, title, description, Icon, action }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div className="flex items-start gap-4">
        <span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
