import { Suspense } from "react";
import PageHeading from "@/components/page-heading";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import EventBrowser from "@/components/event-browser";
import Breadcrumbs from "@/components/breadcrumbs";
type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
};

async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, { cache: "no-store" });

    if (!response.ok) throw new Error("Failed to fetch events");

    return response.json();
  } catch (error) {
    console.error("Events fetch error:", error);
    return [];
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
      <Suspense fallback={<p className="mt-10 text-center text-muted-foreground">Finding events for you...</p>}>
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
      <EventBrowser events={events} initialCategory={category} />
      {events.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Be the first to <Link href="/create-event" className="font-medium text-primary underline-offset-4 hover:underline">create an event</Link> for your community.
        </p>
      )}
    </>
  );
}
