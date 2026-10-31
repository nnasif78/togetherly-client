
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import { toast } from "sonner";

type Event = {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    maxParticipants: number;
    createdBy: string;
};

export default function ManageEventsPage() {
    const { data: session } = authClient.useSession();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user.id) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
            .then((response) => response.json())
            .then((data: Event[]) => {
                setEvents(data.filter((event) => event.createdBy === session.user.id));
            })
            .catch((error) => console.error("Failed to load events:", error))
            .finally(() => setLoading(false));
    }, [session?.user.id]);

    const handleDelete = async (eventId: string) => {
        if (!session?.user.id) {
            toast.error("Please log in first.");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.user.id }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            setEvents((previous) => previous.filter((item) => item._id !== eventId));
            toast.success("Event deleted successfully!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete event.");
        }
    };

    if (loading) {
        return <main className="px-6 py-16 text-center">Loading your events...</main>;
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <p className="mt-2 text-muted-foreground">View and manage the events you created.</p>

            {events.length === 0 ? (
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground">You have not created any events yet.</p>
                    <Link href="/create-event" className="mt-4 inline-block rounded-md bg-primary px-5 py-2 text-primary-foreground">
                        Create an Event
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <article key={event._id} className="rounded-lg border p-5">
                            <p className="text-sm text-primary">{event.category}</p>
                            <h2 className="mt-2 text-xl font-semibold">{event.title}</h2>
                            <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                            <p className="mt-4 text-sm">Date: {new Date(event.date).toLocaleString()}</p>
                            <p className="text-sm">Location: {event.location}</p>
                            <p className="text-sm">Maximum Participants: {event.maxParticipants}</p>

                            <div className="mt-5 flex items-center gap-4">
                                <Link href={`/events/${event._id}`} className="text-sm font-medium text-primary hover:underline">
                                    View Details
                                </Link>
                                <button onClick={() => handleDelete(event._id)} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                                    Delete
                                </button>
                                <Link href={`/edit-event/${event._id}`} className="text-sm font-medium text-primary hover:underline">
                                    Edit
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
