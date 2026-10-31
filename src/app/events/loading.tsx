import { PageHeadingSkeleton, Skeleton, EventListSkeleton } from "@/components/skeletons";

export default function LoadingEvents() {
  return (
    <main aria-busy="true" className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-28" />
      </div>
      <PageHeadingSkeleton />
      <div className="mt-8 space-y-4 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <Skeleton className="h-10 w-full max-w-lg rounded-lg" />
        <div className="flex gap-2 overflow-hidden">
          {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-9 w-24 shrink-0 rounded-full" />)}
        </div>
      </div>
      <Skeleton className="mt-6 h-4 w-32" />
      <EventListSkeleton className="mt-4" />
    </main>
  );
}
