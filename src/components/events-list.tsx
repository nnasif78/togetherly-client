"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventBrowser from "@/components/event-browser";
import { EventListSkeleton } from "@/components/skeletons";
import { getAuthToken } from "@/lib/get-auth-token";

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
};

export default function EventsList({ initialCategory }: { initialCategory?: string }) {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        const token = await getAuthToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch events");
        const result: Event[] = await response.json();
        if (active) setEvents(result);
      } catch (error) {
        console.error("Events fetch error:", error);
        if (active) setFailed(true);
      }
    }

    void loadEvents();
    return () => { active = false; };
  }, []);

  if (events === null && !failed) return <div className="mt-10"><EventListSkeleton /></div>;
  if (failed) {
    return <p role="alert" className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center text-sm text-muted-foreground">
      Upcoming events could not be loaded. Please try again later.
    </p>;
  }

  return (
    <>
      <EventBrowser events={events!} initialCategory={initialCategory} />
      {events!.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Be the first to <Link href="/create-event" className="font-medium text-primary underline-offset-4 hover:underline">create an event</Link> for your community.
        </p>
      )}
    </>
  );
}
