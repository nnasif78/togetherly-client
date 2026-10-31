"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import EventCard from "@/components/event-card";
import { eventMatchesCategory } from "@/lib/event-category";

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants?: number;
  participants?: string[];
  image?: string;
};

const categories = ["All events", "Environment", "Education", "Health", "Community", "Charity", "Other"];

type EventBrowserProps = {
  events: Event[];
  initialCategory?: string;
};

export default function EventBrowser({ events, initialCategory }: EventBrowserProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? initialCategory;
  const category = categories.find((item) => item.toLowerCase() === urlCategory?.trim().toLowerCase()) ?? "All events";
  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => {
      const matchesCategory = eventMatchesCategory(event.category, category);
      const matchesSearch = !query
        || `${event.title} ${event.description} ${event.location} ${event.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, events, search]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <div className="relative max-w-lg">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="event-search" className="sr-only">Search events</label>
          <input
            id="event-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events, places, or causes"
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter events by cause">
          {categories.map((item) => {
            const params = new URLSearchParams(searchParams.toString());
            if (item === "All events") {
              params.delete("category");
            } else {
              params.set("category", item);
            }
            const queryString = params.toString();

            return (
            <Link
              key={item}
              href={queryString ? `${pathname}?${queryString}` : pathname}
              aria-current={category === item ? "true" : undefined}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                category === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item}
            </Link>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} to explore
      </p>
      {filteredEvents.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary"><Sparkles aria-hidden="true" className="size-5" /></span>
          <h2 className="mt-4 text-xl font-semibold">No events match just yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Try another cause or search, or check back soon for something new to join.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </>
  );
}
