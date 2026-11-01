import { Suspense } from "react";
import PageHeading from "@/components/page-heading";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/breadcrumbs";
import EventBrowser from "@/components/event-browser";
import { EventListSkeleton } from "@/components/skeletons";

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
};

async function getEvents(): Promise<Event[] | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch events");
    return response.json();
  } catch (error) {
    console.error("Events fetch error:", error);
    return null;
  }
}

export default function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <main className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Upcoming Events" }]} />
      <PageHeading
        eyebrow="Find your people"
        title="Upcoming events"
        description="Discover a gathering that feels right for you and make a difference in your community."
        Icon={CalendarDays}
      />
      <Suspense fallback={<div className="mt-10"><EventListSkeleton /></div>}>
        <EventsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function EventsContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const events = await getEvents();

  return (
    <>
      {events === null ? (
        <p role="alert" className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center text-sm text-muted-foreground">
          Upcoming events could not be loaded. Please try again later.
        </p>
      ) : (
        <>
          <EventBrowser events={events} initialCategory={category} />
          {events.length === 0 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Be the first to <Link href="/create-event" className="font-medium text-primary underline-offset-4 hover:underline">create an event</Link> for your community.
            </p>
          )}
        </>
      )}
    </>
  );
}
