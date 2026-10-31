"use client";

import { useEffect, useState } from "react";
import { authClient } from "../../lib/auth-client";
import { getAuthToken } from "../../lib/get-auth-token";
import { toast } from "sonner";
import EventCard from "@/components/event-card";
import Link from "next/link";
import PageHeading from "@/components/page-heading";
import Breadcrumbs from "@/components/breadcrumbs";
import { CalendarDays, Compass, Search } from "lucide-react";

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

        const loadJoinedEvents = async () => {
            try {
                const token = await getAuthToken();
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/joined-events`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to load joined events.");
                const data: Event[] = await response.json();
                setEvents(data.sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime()));
            } catch (error) {
                console.error("Failed to load joined events:", error);
                toast.error(error instanceof Error ? error.message : "Failed to load joined events.");
            } finally {
                setLoading(false);
            }
        };

        loadJoinedEvents();
    }, [session?.user.id]);

    if (isPending || (session && loading)) {
        return <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-6 py-16 text-center text-muted-foreground">Loading your events...</main>;
    }

    return (
        <main className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Joined Events" }]} />
            <PageHeading
                eyebrow="Your time, well spent"
                title="Events you joined"
                description="Keep the good things you signed up for close at hand."
                Icon={CalendarDays}
                action={
                    <Link href="/events" className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                        <Search aria-hidden="true" className="size-4" />
                        Find another event
                    </Link>
                }
            />

            {events.length === 0 ? (
                <div className="mt-9 rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
                    <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary"><CalendarDays aria-hidden="true" className="size-5" /></span>
                    <h2 className="mt-4 text-xl font-semibold">There&apos;s a place for you out there</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Explore local events, find something that matters to you, and join the people making it happen.</p>
                    <Link href="/events" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                        Explore upcoming events <Compass aria-hidden="true" className="size-4" />
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => <EventCard key={event._id} event={event} showTime />)}
                </div>
            )}
        </main>
    );
}
