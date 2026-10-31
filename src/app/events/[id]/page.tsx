
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import { getAuthToken } from "../../../lib/get-auth-token";
import { toast } from "sonner";
import Link from "next/link";
import { CalendarDays, CheckCircle2, HeartHandshake, LoaderCircle, LogIn, MapPin, Sparkles, UsersRound, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareButton from "@/components/share-button";
import { getEventCategoryStyles } from "@/lib/event-category";
import Breadcrumbs from "@/components/breadcrumbs";
import { createEventSlug } from "@/lib/event-slug";
import { EventDetailsSkeleton } from "@/components/skeletons";
import LoadingImage from "@/components/loading-image";

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
    return (
        <Suspense fallback={<EventDetailsSkeleton />}>
            <EventDetailsContent />
        </Suspense>
    );
}

function EventDetailsContent() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [event, setEvent] = useState<Event | null>(null);
    const [settledEventId, setSettledEventId] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const isMongoId = /^[a-f\d]{24}$/i.test(id);
        const eventEndpoint = isMongoId
            ? `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/events/by-slug/${encodeURIComponent(id)}`;

        fetch(eventEndpoint)
            .then((response) => {
                if (!response.ok) throw new Error("Event not found.");
                return response.json();
            })
            .then((data: Event) => {
                setEvent(data);
                const canonicalSlug = createEventSlug(data);
                if (isMongoId) router.replace(`/events/${canonicalSlug}`);
                else if (id !== canonicalSlug) router.replace(`/events/${canonicalSlug}`);
            })
            .catch((error: unknown) => {
                const message = error instanceof Error ? error.message : "Failed to load event.";
                setLoadError(message);
                toast.error(message);
            })
            .finally(() => setSettledEventId(id));
    }, [id, router]);

    const handleJoin = async () => {
        if (!session?.user.id) {
            toast.error("Please log in to join this event.");
            return;
        }

        setJoining(true);

        try {
            const token = await getAuthToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${event?._id}/join`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
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

    if (settledEventId !== id) {
        return <EventDetailsSkeleton />;
    }

    if (!event) {
        return (
            <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Upcoming Events", href: "/events" }, { label: "Event Details" }]} />
                <div className="py-8 text-center">
                    <h1 className="text-3xl font-bold">{loadError && loadError !== "Event not found." ? "Unable to load event" : "Event Not Found"}</h1>
                    {loadError && loadError !== "Event not found." && <p role="alert" className="mt-3 text-muted-foreground">{loadError}</p>}
                    <Link href="/events" className="mt-4 inline-flex font-medium text-primary hover:underline">Back to Events</Link>
                </div>
            </main>
        );
    }

    const participants = event.participants || [];
    const alreadyJoined = participants.includes(session?.user.id || "");
    const isFull = participants.length >= event.maxParticipants;

    return (
        <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Upcoming Events", href: "/events" }, { label: "Event Details" }]} />
            {event.image ? (
                <LoadingImage src={event.image} alt={event.title} loading="eager" containerClassName="mb-7 h-64 w-full rounded-2xl shadow-sm sm:h-80" className="size-full object-cover" />
            ) : (
                <div className={`relative mb-7 flex h-56 items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-secondary via-background to-accent sm:h-72 ${getEventCategoryStyles(event.category)}`}>
                    <div aria-hidden="true" className="absolute -right-10 -top-20 size-64 rounded-full border border-current/10" />
                    <div aria-hidden="true" className="absolute -bottom-28 -left-10 size-72 rounded-full border border-current/10" />
                    <HeartHandshake aria-hidden="true" className="size-24 stroke-[1.1] opacity-40 sm:size-32" />
                    <span className="absolute bottom-5 right-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
                        <Sparkles aria-hidden="true" className="size-4" />
                        Good things happen together
                    </span>
                </div>
            )}

            <article className="rounded-2xl border bg-card p-6 shadow-sm sm:p-9">
                <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getEventCategoryStyles(event.category)}`}>
                    {event.category}
                </span>
                <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl">{event.title}</h1>
                <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{event.description}</p>

                <dl className="mt-7 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
                        <CalendarDays aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div>
                            <dt className="font-medium">Date and time</dt>
                            <dd className="mt-1 text-muted-foreground">{new Date(event.date).toLocaleString()}</dd>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
                        <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div>
                            <dt className="font-medium">Location</dt>
                            <dd className="mt-1 text-muted-foreground">{event.location}</dd>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
                        <UsersRound aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div>
                            <dt className="font-medium">Participants</dt>
                            <dd className="mt-1 text-muted-foreground">{participants.length} of {event.maxParticipants} joined</dd>
                        </div>
                    </div>
                </dl>

                <section className="mt-8 border-t pt-6">
                    <h2 className="text-xl font-semibold">About this event</h2>
                    <p className="mt-3 max-w-3xl whitespace-pre-line leading-7 text-muted-foreground">{event.description}</p>
                </section>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <ShareButton />
                    {isPending ? (
                        <span role="status" aria-label="Checking your account" aria-busy="true"><span className="sr-only">Checking your account</span><span aria-hidden="true" className="skeleton-shimmer inline-flex h-10 w-32 rounded-md" /></span>
                    ) : !session ? (
                        <div className="flex flex-wrap items-center gap-3">
                            <p className="text-sm text-muted-foreground">Sign in to join this event.</p>
                            <Link href={`/login?returnTo=${encodeURIComponent(`/events/${id}`)}`} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                                <LogIn aria-hidden="true" className="size-4" />
                                Log in
                            </Link>
                        </div>
                    ) : alreadyJoined ? (
                        <p className="inline-flex items-center gap-2 font-medium text-success">
                            <CheckCircle2 aria-hidden="true" className="size-5" />
                            You have joined this event!
                        </p>
                    ) : (
                        <Button type="button" onClick={handleJoin} disabled={joining || isFull}>
                            {joining ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <UserPlus aria-hidden="true" />}
                            {joining ? "Joining..." : isFull ? "Event full" : "Join event"}
                        </Button>
                    )}
                </div>
            </article>
        </main>
    );
}
