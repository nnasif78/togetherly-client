import PageHeading from "@/components/page-heading";
import { CalendarDays } from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import EventsList from "@/components/events-list";

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
      <EventsContent searchParams={searchParams} />
    </main>
  );
}

async function EventsContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <EventsList initialCategory={category} />
  );
}
