import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Heart,
  HeartHandshake,
  HeartPulse,
  Leaf,
  MapPin,
  Sparkles,
  Sprout,
  Trees,
  UsersRound,
} from "lucide-react";
import EventCard from "@/components/event-card";

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

async function getRecentEvents(): Promise<Event[]> {
  await connection();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recent-events`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch recent events");

    return response.json();
  } catch (error) {
    console.error("Recent events fetch error:", error);
    return [];
  }
}

const categories = [
  { name: "Environment", description: "Care for the places we call home.", Icon: Trees, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" },
  { name: "Education", description: "Share knowledge and open doors.", Icon: BookOpen, color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200" },
  { name: "Health", description: "Help people feel supported and well.", Icon: HeartPulse, color: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200" },
  { name: "Community", description: "Make your neighborhood feel closer.", Icon: UsersRound, color: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200" },
  { name: "Charity", description: "Turn a little generosity into a lot.", Icon: HeartHandshake, color: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200" },
  { name: "Something else", description: "There is room for every good idea.", Icon: Sparkles, color: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200" },
];

const initiatives = [
  {
    number: "01",
    title: "Greener together",
    description: "From planting days to neighborhood cleanups, make care for the environment a team effort.",
    Icon: Sprout,
    art: "from-emerald-100 via-teal-50 to-lime-100 text-emerald-800 dark:from-emerald-950 dark:via-teal-950 dark:to-lime-950 dark:text-emerald-200",
  },
  {
    number: "02",
    title: "Knowledge in motion",
    description: "Create welcoming spaces to learn, mentor, and share what you know with your community.",
    Icon: BookOpen,
    art: "from-sky-100 via-blue-50 to-indigo-100 text-blue-800 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950 dark:text-blue-200",
  },
  {
    number: "03",
    title: "Care that connects",
    description: "Show up for neighbors through thoughtful acts, shared resources, and simple human connection.",
    Icon: Heart,
    art: "from-rose-100 via-pink-50 to-orange-100 text-rose-800 dark:from-rose-950 dark:via-pink-950 dark:to-orange-950 dark:text-rose-200",
  },
];

function CommunityScene() {
  return (
    <div className="relative mx-auto aspect-[1.05/1] w-full max-w-[34rem] overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-200 via-teal-100 to-amber-100 shadow-xl shadow-emerald-950/10 dark:from-emerald-950 dark:via-teal-950 dark:to-amber-950">
      <div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full bg-amber-200/80 dark:bg-amber-700/40" />
      <div aria-hidden="true" className="absolute -bottom-36 -left-12 size-[28rem] rounded-full bg-emerald-500/20 dark:bg-emerald-400/10" />
      <svg
        aria-label="Neighbors working together in a community garden"
        role="img"
        viewBox="0 0 560 520"
        className="absolute inset-0 size-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 370C82 335 168 368 264 352C365 335 460 338 560 365V520H0V370Z" fill="#50866F" />
        <path d="M0 410C100 378 176 414 284 386C396 358 470 390 560 376V520H0V410Z" fill="#39735E" />
        <path d="M0 459C113 421 195 461 302 432C389 408 487 423 560 409V520H0V459Z" fill="#2C6452" />
        <path d="M88 343C82 282 105 232 145 197C183 232 207 286 193 351" fill="#6BAE78" />
        <path d="M103 327C132 285 146 245 145 197M164 338C141 299 128 270 126 237" stroke="#E7F5D6" strokeWidth="5" strokeLinecap="round" />
        <path d="M408 344C407 293 424 254 463 220C500 256 514 298 499 352" fill="#86B96B" />
        <path d="M425 333C447 294 460 260 463 220M481 341C462 306 450 280 450 255" stroke="#F0F6D9" strokeWidth="5" strokeLinecap="round" />
        <path d="M222 398C223 363 225 343 231 320" stroke="#EBC49E" strokeWidth="35" strokeLinecap="round" />
        <path d="M282 395C287 360 292 342 304 322" stroke="#D59B72" strokeWidth="35" strokeLinecap="round" />
        <path d="M359 397C355 363 350 343 341 323" stroke="#F1C8A1" strokeWidth="35" strokeLinecap="round" />
        <path d="M200 351C203 321 220 301 247 302C274 304 287 329 283 357" fill="#28665A" />
        <path d="M281 354C282 322 300 302 327 304C354 306 368 331 362 360" fill="#D87958" />
        <circle cx="242" cy="278" r="26" fill="#B97956" />
        <circle cx="320" cy="279" r="26" fill="#E5AD82" />
        <path d="M216 276C214 253 226 240 246 241C260 242 268 252 268 270C251 262 236 263 216 276Z" fill="#3E3330" />
        <path d="M294 271C293 248 306 235 326 238C344 240 353 255 347 274C332 259 313 261 294 271Z" fill="#49382F" />
        <path d="M233 359L215 399M344 360L366 399M230 326L198 340M352 327L379 344" stroke="#F3D1AC" strokeWidth="14" strokeLinecap="round" />
        <path d="M213 394H239M346 395H372" stroke="#2B4238" strokeWidth="14" strokeLinecap="round" />
        <path d="M269 383C278 365 286 353 297 343" stroke="#F1C8A1" strokeWidth="12" strokeLinecap="round" />
        <path d="M298 348C305 336 316 335 324 343L315 355L300 359" fill="#4B9366" />
        <path d="M268 378C255 367 243 366 233 374L243 388L260 390" fill="#4B9366" />
        <path d="M51 130H120M440 147H497" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" />
        <circle cx="473" cy="92" r="8" fill="#FFFFFF" fillOpacity=".75" />
        <circle cx="86" cy="173" r="6" fill="#FFFFFF" fillOpacity=".7" />
      </svg>
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/50 bg-white/80 p-4 text-slate-900 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-slate-950/75 dark:text-white">
        <div>
          <p className="text-sm font-semibold">Good things grow together.</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Find a local way to pitch in.</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Leaf aria-hidden="true" className="size-5" />
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section className="overflow-hidden border-b border-emerald-900/5 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-emerald-100/80 via-background to-amber-50/60 dark:from-emerald-950/60 dark:via-background dark:to-amber-950/20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-sm font-medium text-primary shadow-sm">
              <Sparkles aria-hidden="true" className="size-4" />
              Small acts. Stronger communities.
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Good things happen when we{" "}
              <span className="text-primary">show up.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Find a cause that moves you, meet people who care, and make a difference right where you live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/events"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-5 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Find an event
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                href="/create-event"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-background/80 px-5 font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Start something good
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-border/70 pt-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><UsersRound aria-hidden="true" className="size-4 text-primary" />Find your people</span>
              <span className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="size-4 text-primary" />Make it local</span>
              <span className="inline-flex items-center gap-2"><Heart aria-hidden="true" className="size-4 text-primary" />Lead with care</span>
            </div>
          </div>
          <CommunityScene />
        </div>
      </section>

      <section aria-labelledby="impact-title" className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">A little can mean a lot</p>
          <h2 id="impact-title" className="mt-3 max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
            Change starts with showing up for each other.
          </h2>
          <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
            You don&apos;t need a big plan to make a real difference. Start with one shared idea, one open invitation, and the people around you.
          </p>
          <Link href="/events" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            See what&apos;s happening nearby <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { number: "01", title: "Find your cause", text: "Explore the things you care about and discover a good place to begin.", Icon: Sparkles },
            { number: "02", title: "Meet your people", text: "Connect with neighbors who are ready to lend a hand.", Icon: UsersRound },
            { number: "03", title: "Make it happen", text: "Join an event or bring your own community idea to life.", Icon: HeartHandshake },
          ].map(({ number, title, text, Icon }) => (
            <article key={number} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-widest text-muted-foreground">{number}</span>
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary"><Icon aria-hidden="true" className="size-5" /></span>
              </div>
              <h3 className="mt-7 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="categories-title" className="bg-secondary/45 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Find your kind of good</p>
              <h2 id="categories-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">What matters to you?</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">There are lots of ways to care for a community. Start with what speaks to you.</p>
            </div>
            <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Browse all events <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, description, Icon, color }) => (
              <Link
                href={`/events?category=${encodeURIComponent(name === "Something else" ? "Other" : name)}`}
                key={name}
                className="group flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
                </span>
                <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<FeaturedEventsFallback />}>
        <FeaturedEvents />
      </Suspense>

      <section aria-labelledby="initiatives-title" className="bg-brand-panel py-16 text-brand-panel-foreground sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Ideas with room to grow</p>
            <h2 id="initiatives-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Many ways to make a difference.</h2>
            <p className="mt-4 leading-7 text-brand-panel-muted">
              Every neighborhood has its own needs and bright ideas. Here are a few places your next community gathering could begin.
            </p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {initiatives.map(({ number, title, description, Icon, art }) => (
              <article key={number} className="overflow-hidden rounded-2xl border border-brand-panel-border bg-card text-card-foreground shadow-sm">
                <div className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${art}`}>
                  <div aria-hidden="true" className="absolute -right-8 -top-12 size-40 rounded-full border border-current/15" />
                  <div aria-hidden="true" className="absolute -bottom-16 -left-6 size-44 rounded-full border border-current/15" />
                  <Icon aria-hidden="true" className="size-20 stroke-[1.2]" />
                  <span className="absolute bottom-4 right-5 text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Togetherly</span>
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold tracking-widest text-primary">{number} / COMMUNITY IDEA</p>
                  <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-panel-border bg-background/70 p-5 sm:p-6">
            <p className="font-medium">Have another idea for your neighborhood? It starts with an invitation.</p>
            <Link href="/create-event" className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              Start an event <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="gallery-title" className="bg-muted/35 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">The good is all around us</p>
            <h2 id="gallery-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Picture a closer community.</h2>
          </div>
          <p className="max-w-md leading-6 text-muted-foreground">A garden tended together. A skill passed on. A neighbor who feels seen. It can start right here.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=85",
              alt: "Volunteers gathering to work together in their community",
              label: "Care for the places we share",
              title: "A little greener, together.",
            },
            {
              image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1000&q=85",
              alt: "Community members sharing support and resources",
              label: "Share what you can",
              title: "Kindness has a ripple effect.",
            },
            {
              image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=85",
              alt: "Neighbors coming together for a community activity",
              label: "Make someone feel welcome",
              title: "Care is better shared.",
            },
          ].map(({ image, alt, label, title }) => (
            <article key={image} className="group relative h-64 overflow-hidden rounded-2xl bg-brand-panel shadow-sm">
              <img src={image} alt={alt} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">{label}</p>
                <h3 className="mt-2 text-xl font-semibold">{title}</h3>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>

      <section aria-labelledby="newsletter-title" className="bg-secondary/45 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">A little good in your inbox</p>
            <h2 id="newsletter-title" className="mt-3 text-3xl font-semibold tracking-tight">Stay close to what&apos;s happening.</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Get occasional community stories and new ways to show up for the people around you.</p>
          </div>
          <div className="flex w-full max-w-md gap-2 rounded-2xl border bg-card p-2 shadow-sm">
            <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
            <input id="newsletter-email" type="email" placeholder="Your email address" disabled className="min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed" />
            <button type="button" disabled className="shrink-0 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground opacity-70">
              Coming soon
            </button>
          </div>
        </div>
      </section>

      <section className="mt-20 px-6 pb-16 sm:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-primary px-7 py-10 text-primary-foreground sm:px-10 sm:py-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-80">Your community is better with you in it</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Ready to make a little good happen?</h2>
            <p className="mt-3 max-w-xl leading-7 opacity-85">Join an event, meet the people behind it, or create a gathering of your own.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/events" className="inline-flex h-11 items-center gap-2 rounded-md bg-background px-5 font-semibold text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-background/60">
              Explore events <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link href="/register" className="inline-flex h-11 items-center rounded-md border border-primary-foreground/40 px-5 font-semibold transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/60">
              Join Togetherly
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

async function FeaturedEvents() {
  const events = await getRecentEvents();

  return (
    <section id="featured-events" aria-labelledby="events-title" className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Make your next move</p>
          <h2 id="events-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Good things are happening</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Find a gathering that feels right for you and be part of something local.</p>
        </div>
        <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          See all events <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary"><CalendarDays aria-hidden="true" className="size-5" /></span>
          <h3 className="mt-4 text-lg font-semibold">Your next good thing is waiting</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            There aren&apos;t any upcoming events just yet. Check back soon or be the first to start one.
          </p>
          <Link href="/create-event" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            Create an event <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </section>
  );
}

function FeaturedEventsFallback() {
  return (
    <section id="featured-events" aria-label="Featured events" className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-muted" />)}
      </div>
    </section>
  );
}
