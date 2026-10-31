import Link from "next/link";
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

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Upcoming Events</h1>
      <p className="mt-2 text-muted-foreground">Discover events and make a difference in your community.</p>

      {events.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">No upcoming events available yet.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article key={event._id} className="rounded-lg border p-5">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
              <p className="mt-4 text-sm">Date: {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-sm">Location: {event.location}</p>
              <p className="text-sm">Category: {event.category}</p>
              <Link href={`/events/${event._id}`} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                View Details
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
