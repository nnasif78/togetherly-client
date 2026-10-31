
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import { toast } from "sonner";

type Event = {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    maxParticipants: number;
    image?: string;
    participants: string[];
};

export default function EventDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { data: session, isPending } = authClient.useSession();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
            .then((response) => response.json())
            .then((events: Event[]) => {
                setEvent(events.find((item) => item._id === id) || null);
            })
            .catch(() => toast.error("Failed to load event."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleJoin = async () => {
        if (!session?.user.id) {
            toast.error("Please log in to join this event.");
            return;
        }

        setJoining(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.user.id }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            setEvent((previous) => previous ? {
                ...previous,
                participants: [...(previous.participants || []), session.user.id],
            } : null);

            toast.success("You joined the event successfully!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to join event.");
        } finally {
            setJoining(false);
        }
    };

    if (loading) return <main className="px-6 py-16 text-center">Loading event...</main>;

    if (!event) {
        return <main className="px-6 py-16 text-center"><h1 className="text-3xl font-bold">Event Not Found</h1></main>;
    }

    const participants = event.participants || [];
    const alreadyJoined = participants.includes(session?.user.id || "");
    const isFull = participants.length >= event.maxParticipants;

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            {event.image && <img src={event.image} alt={event.title} className="mb-8 h-72 w-full rounded-xl object-cover" />}

            <p className="text-sm font-medium text-primary">{event.category}</p>
            <h1 className="mt-2 text-3xl font-bold">{event.title}</h1>

            <div className="mt-6 space-y-3">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Maximum Participants:</strong> {event.maxParticipants}</p>
                <p><strong>Joined Participants:</strong> {participants.length}</p>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold">About This Event</h2>
                <p className="mt-3 whitespace-pre-line text-muted-foreground">{event.description}</p>
            </div>

            <div className="mt-8">
                {isPending ? (
                    <p className="text-sm text-muted-foreground">Checking your account...</p>
                ) : !session ? (
                    <p className="text-sm text-muted-foreground">Please log in to join this event.</p>
                ) : alreadyJoined ? (
                    <p className="font-medium text-green-600">You have joined this event!</p>
                ) : (
                    <button onClick={handleJoin} disabled={joining || isFull} className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50">
                        {joining ? "Joining..." : isFull ? "Event Full" : "Join Event"}
                    </button>
                )}
            </div>
        </main>
    );
}
