import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Sparkles,
  Trees,
  UsersRound,
} from "lucide-react";
import { getEventCategoryStyles } from "@/lib/event-category";
import { createEventSlug } from "@/lib/event-slug";
import LoadingImage from "@/components/loading-image";

type EventCardData = {
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

type EventCardProps = {
  event: EventCardData;
  actions?: React.ReactNode;
  showTime?: boolean;
};

const categoryArtwork: Record<string, { Icon: typeof Trees; style: string }> = {
  environment: { Icon: Trees, style: "from-emerald-100 via-teal-50 to-lime-100 text-emerald-800 dark:from-emerald-950 dark:via-teal-950 dark:to-lime-950 dark:text-emerald-200" },
  cleanup: { Icon: Trees, style: "from-emerald-100 via-teal-50 to-lime-100 text-emerald-800 dark:from-emerald-950 dark:via-teal-950 dark:to-lime-950 dark:text-emerald-200" },
  plantation: { Icon: Trees, style: "from-emerald-100 via-teal-50 to-lime-100 text-emerald-800 dark:from-emerald-950 dark:via-teal-950 dark:to-lime-950 dark:text-emerald-200" },
  education: { Icon: BookOpen, style: "from-sky-100 via-blue-50 to-indigo-100 text-blue-800 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950 dark:text-blue-200" },
  health: { Icon: HeartPulse, style: "from-rose-100 via-pink-50 to-orange-100 text-rose-800 dark:from-rose-950 dark:via-pink-950 dark:to-orange-950 dark:text-rose-200" },
  community: { Icon: UsersRound, style: "from-amber-100 via-orange-50 to-yellow-100 text-amber-900 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 dark:text-amber-200" },
  charity: { Icon: HeartHandshake, style: "from-violet-100 via-fuchsia-50 to-pink-100 text-violet-800 dark:from-violet-950 dark:via-fuchsia-950 dark:to-pink-950 dark:text-violet-200" },
  donation: { Icon: HeartHandshake, style: "from-violet-100 via-fuchsia-50 to-pink-100 text-violet-800 dark:from-violet-950 dark:via-fuchsia-950 dark:to-pink-950 dark:text-violet-200" },
  other: { Icon: Sparkles, style: "from-teal-100 via-cyan-50 to-sky-100 text-teal-800 dark:from-teal-950 dark:via-cyan-950 dark:to-sky-950 dark:text-teal-200" },
} satisfies Record<string, { Icon: typeof Trees; style: string }>;

export default function EventCard({ event, actions, showTime = false }: EventCardProps) {
  const date = new Date(event.date);
  const dateLabel = Number.isNaN(date.getTime())
    ? "Date to be announced"
    : date.toLocaleString(undefined, showTime
      ? { dateStyle: "medium", timeStyle: "short" }
      : { dateStyle: "medium" });
  const artwork = categoryArtwork[event.category.trim().toLowerCase()]
    ?? categoryArtwork.other;
  const { Icon } = artwork;
  const participants = event.participants?.length;
  const capacity = event.maxParticipants;
  const hasCapacity = typeof capacity === "number" && capacity > 0;
  const availability = hasCapacity && participants !== undefined
    ? Math.max(0, capacity - participants)
    : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${artwork.style}`}>
        {event.image ? (
          <LoadingImage
            src={event.image}
            alt=""
            containerClassName="size-full"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div aria-hidden="true" className="absolute -right-10 -top-16 size-56 rounded-full border border-current/10" />
            <div aria-hidden="true" className="absolute -right-1 -top-7 size-36 rounded-full border border-current/10" />
            <div aria-hidden="true" className="absolute -bottom-16 -left-7 size-44 rounded-full bg-white/30 dark:bg-white/5" />
            <Icon aria-hidden="true" className="absolute bottom-7 right-8 size-24 stroke-[1.2] opacity-80" />
            <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
              Together, locally
            </span>
          </>
        )}
        <span className={`absolute left-4 top-4 inline-flex rounded-full border bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur ${getEventCategoryStyles(event.category)}`}>
          {event.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h2 className="text-xl font-semibold leading-snug">{event.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{event.description}</p>

        <dl className="mt-5 space-y-3 border-t pt-4 text-sm">
          <div className="flex items-start gap-3">
            <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <dt className="sr-only">Date</dt>
            <dd>{dateLabel}</dd>
          </div>
          <div className="flex items-start gap-3">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <dt className="sr-only">Location</dt>
            <dd className="line-clamp-2">{event.location}</dd>
          </div>
          {hasCapacity && (
            <div className="flex items-start gap-3">
              <UsersRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <dt className="sr-only">Event capacity</dt>
              <dd>
                {participants !== undefined ? `${participants} joined · ` : ""}
                {availability !== null
                  ? `${availability} ${availability === 1 ? "spot" : "spots"} left`
                  : `${capacity} ${capacity === 1 ? "place" : "places"} available`}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <Link
            href={`/events/${createEventSlug(event)}`}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            View Event
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          {actions}
        </div>
      </div>
    </article>
  );
}
