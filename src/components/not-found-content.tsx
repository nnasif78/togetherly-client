import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFoundContent() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6"
    >
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Compass aria-hidden="true" className="size-8" />
      </div>
      <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-primary">404</p>
      <h1 id="not-found-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
        This page wandered off.
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        We couldn&apos;t find the page you&apos;re looking for. It may have moved, or the link may be incorrect.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Back to home
        </Link>
        <Link
          href="/events"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Explore events
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
