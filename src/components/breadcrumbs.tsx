import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-7">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 && <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground/70" />}
              {item.href && !current ? (
                <Link href={item.href} className="transition-colors hover:text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={current ? "page" : undefined} className={current ? "font-medium text-foreground" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
