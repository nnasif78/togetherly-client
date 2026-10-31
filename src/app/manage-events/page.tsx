"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import { getAuthToken } from "../../lib/get-auth-token";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CalendarPlus, FolderKanban, Pencil, Trash2 } from "lucide-react";
import EventCard from "@/components/event-card";
import PageHeading from "@/components/page-heading";
import Breadcrumbs from "@/components/breadcrumbs";
import { createEventSlug } from "@/lib/event-slug";

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
    const { data: session, isPending } = authClient.useSession();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

    useEffect(() => {
        if (!session?.user.id) return;

        const loadEvents = async () => {
            try {
                const token = await getAuthToken();

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-events`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to load your events.");

                const data: Event[] = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Failed to load events:", error);
                toast.error("Failed to load your events.");
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [session?.user.id]);

    const handleDelete = async (eventId: string) => {
        const event = events.find((item) => item._id === eventId);
        if (!event || !window.confirm(`Delete "${event.title}"? This action cannot be undone.`)) return;

        setDeletingEventId(eventId);
        try {
            const token = await getAuthToken();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message);

            setEvents((previous) => previous.filter((item) => item._id !== eventId));
            toast.success("Event deleted successfully!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete event.");
        } finally {
            setDeletingEventId(null);
        }
    };

    if (isPending || loading) {
        return         <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-6 py-16 text-center text-muted-foreground">Loading your events...</main>;
    }

    return (
        <main className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Manage Events" }]} />
            <PageHeading
                eyebrow="Your community, your ideas"
                title="Manage your events"
                description="Keep an eye on the gatherings you started and make updates whenever you need."
                Icon={FolderKanban}
                action={
                    <Link href="/create-event" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                        <CalendarPlus aria-hidden="true" className="size-4" />
                        Create event
                    </Link>
                }
            />

            {events.length === 0 ? (
                <div className="mt-9 rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
                    <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary"><FolderKanban aria-hidden="true" className="size-5" /></span>
                    <h2 className="mt-4 text-xl font-semibold">Your first event starts with an idea</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Create a welcoming place for your neighbors to meet, lend a hand, and make something good happen.</p>
                    <Link href="/create-event" className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                        <CalendarPlus aria-hidden="true" className="size-4" />
                        Create your first event
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            showTime
                            actions={
                                <>
                                    <Link
                                        href={`/edit-event/${createEventSlug(event)}`}
                                        className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                                    >
                                        <Pencil aria-hidden="true" className="size-4" />
                                        Edit Event
                                    </Link>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(event._id)}
                                        disabled={deletingEventId !== null}
                                    >
                                        <Trash2 aria-hidden="true" />
                                        {deletingEventId === event._id ? "Deleting..." : "Delete"}
                                    </Button>
                                </>
                            }
                        />
                    ))}
                </div>
            )}
        </main>
    );
}