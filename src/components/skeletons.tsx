import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div aria-hidden="true" className={`skeleton-shimmer rounded-md ${className}`} />;
}

function LoadingRegion({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="status" aria-label={label} aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <LoaderCircle className="size-4 shrink-0 animate-spin text-primary" />
        <span>{label}...</span>
      </span>
      {children}
    </div>
  );
}

export function PageHeadingSkeleton({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div className="flex items-start gap-4">
        <Skeleton className="mt-1 size-12 shrink-0 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-9 w-64 max-w-[70vw]" />
          <Skeleton className="h-5 w-[min(36rem,70vw)]" />
        </div>
      </div>
      {withAction && <Skeleton className="h-10 w-36 rounded-md" />}
    </div>
  );
}

export function EventCardSkeleton({ withActions = false }: { withActions?: boolean }) {
  return (
    <article aria-hidden="true" className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="relative h-48">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        <Skeleton className="absolute left-4 top-4 h-6 w-24 rounded-full" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Skeleton className="h-6 w-4/5" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="mt-5 space-y-3 border-t pt-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="mt-auto flex gap-2 pt-6">
          <Skeleton className="h-10 w-32 rounded-md" />
          {withActions && (
            <>
              <Skeleton className="h-10 w-28 rounded-md" />
              <Skeleton className="h-10 w-20 rounded-md" />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function EventListSkeleton({
  count = 6,
  withActions = false,
  className = "",
}: {
  count?: number;
  withActions?: boolean;
  className?: string;
}) {
  return (
    <LoadingRegion label="Loading events" className={className}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <EventCardSkeleton key={index} withActions={withActions} />
        ))}
      </div>
    </LoadingRegion>
  );
}

export function EventDetailsSkeleton() {
  return (
    <LoadingRegion label="Loading event details" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div aria-hidden="true">
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="mb-7 h-64 w-full rounded-2xl sm:h-80" />
        <article className="rounded-2xl border bg-card p-6 shadow-sm sm:p-9">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="mt-5 h-10 w-3/4 max-w-3xl" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-5 w-full max-w-3xl" />
            <Skeleton className="h-5 w-4/5 max-w-3xl" />
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="space-y-3 rounded-xl bg-secondary/60 p-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-6">
            <Skeleton className="h-6 w-48" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full max-w-3xl" />
              <Skeleton className="h-4 w-5/6 max-w-3xl" />
              <Skeleton className="h-4 w-2/3 max-w-3xl" />
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </article>
      </div>
    </LoadingRegion>
  );
}

function FormFieldSkeleton({ tall = false, hint = false, wide = false }: { tall?: boolean; hint?: boolean; wide?: boolean }) {
  return (
    <div className={`space-y-2 ${wide ? "sm:col-span-2" : ""}`}>
      <Skeleton className="h-4 w-32" />
      <Skeleton className={tall ? "h-32 w-full rounded-lg" : "h-10 w-full rounded-lg"} />
      {hint && <Skeleton className="h-3 w-48" />}
    </div>
  );
}

export function EventFormSkeleton({ withSidebar = false }: { withSidebar?: boolean }) {
  return (
    <LoadingRegion label="Loading event form" className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
      <div aria-hidden="true">
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-28" />
        </div>
        <PageHeadingSkeleton />
        <div className={`mt-9 grid items-start gap-6 ${withSidebar ? "lg:grid-cols-[minmax(0,1.65fr)_minmax(16rem,0.75fr)]" : ""}`}>
          <div className="space-y-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormFieldSkeleton wide />
              <FormFieldSkeleton tall wide />
              <FormFieldSkeleton />
              <FormFieldSkeleton />
              <FormFieldSkeleton />
              <FormFieldSkeleton />
              <FormFieldSkeleton hint wide />
            </div>
            <div className="border-t pt-5">
              <Skeleton className="h-11 w-36 rounded-md" />
            </div>
          </div>
          {withSidebar && (
            <aside className="space-y-5 rounded-2xl bg-secondary/60 p-6 sm:p-7">
              <Skeleton className="size-11 rounded-xl" />
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </aside>
          )}
        </div>
      </div>
    </LoadingRegion>
  );
}

export function ProfileSkeleton() {
  return (
    <LoadingRegion label="Loading profile settings" className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
      <div aria-hidden="true">
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-28" />
        </div>
        <PageHeadingSkeleton />
        <div className="mt-9 max-w-2xl space-y-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    </LoadingRegion>
  );
}
