
type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants: number;
  image?: string;
};

async function getEvent(id: string): Promise<Event | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const events: Event[] = await response.json();
    return events.find((event) => event._id === id) || null;
  } catch {
    return null;
  }
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Event Not Found</h1>
        <p className="mt-3 text-muted-foreground">This event may have been removed or does not exist.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {event.image && (
        <img src={event.image} alt={event.title} className="mb-8 h-72 w-full rounded-xl object-cover" />
      )}

      <p className="text-sm font-medium text-primary">{event.category}</p>
      <h1 className="mt-2 text-3xl font-bold">{event.title}</h1>

      <div className="mt-6 space-y-3">
        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Maximum Participants:</strong> {event.maxParticipants}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">About This Event</h2>
        <p className="mt-3 whitespace-pre-line text-muted-foreground">{event.description}</p>
      </div>
    </main>
  );
}
