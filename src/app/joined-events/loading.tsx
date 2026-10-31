import { PageHeadingSkeleton, EventListSkeleton, Skeleton } from "@/components/skeletons";

export default function LoadingJoinedEvents() {
  return (
    <main aria-busy="true" className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-32" />
      </div>
      <PageHeadingSkeleton withAction />
      <EventListSkeleton className="mt-8" />
    </main>
  );
}
