"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";

type Event = {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    participants: string[];
};

export default function JoinedEventsPage() {
    const { data: session, isPending } = authClient.useSession();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user.id) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
            .then((response) => response.json())
            .then((data: Event[]) => {
                setEvents(data.filter((event) => event.participants?.includes(session.user.id)));
            })
            .catch(() => console.error("Failed to load joined events."))
            .finally(() => setLoading(false));
    }, [session?.user.id]);

    if (isPending || (session && loading)) {
        return <main className="px-6 py-16 text-center">Loading...</main>;
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-10">
            <h1 className="text-3xl font-bold">Joined Events</h1>
            <p className="mt-2 text-muted-foreground">Events you have joined.</p>

            {events.length === 0 ? (
                <p className="mt-10 text-center text-muted-foreground">You have not joined any events yet.</p>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div key={event._id} className="rounded-xl border p-5">
                            <p className="text-sm text-primary">{event.category}</p>
                            <h2 className="mt-2 text-xl font-semibold">{event.title}</h2>
                            <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
                            <p className="mt-1 text-sm">{new Date(event.date).toLocaleString()}</p>
                            <Link href={`/events/${event._id}`} className="mt-4 inline-block font-medium text-primary hover:underline">
                                View Event →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}