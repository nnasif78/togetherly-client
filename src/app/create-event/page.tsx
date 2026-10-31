
"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "../../lib/auth-client";
import { getAuthToken } from "../../lib/get-auth-token";
import { AlignLeft, CalendarDays, CalendarPlus, Check, Image as ImageIcon, LoaderCircle, MapPin, Tag, Type, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeading from "@/components/page-heading";
import Breadcrumbs from "@/components/breadcrumbs";
import { EventFormSkeleton } from "@/components/skeletons";

function getLocalDateTimeMin() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

const fieldClassName = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const subscribeToDate = () => () => {};
const getServerDate = () => "";

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const minimumDateTime = useSyncExternalStore(subscribeToDate, getLocalDateTimeMin, getServerDate);

  if (isPending) return <EventFormSkeleton withSidebar />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const dateValue = formData.get("date");
    const eventDate = typeof dateValue === "string" ? new Date(dateValue) : null;

    if (!eventDate || !Number.isFinite(eventDate.getTime()) || eventDate.getTime() <= Date.now()) {
      toast.error("Please choose a valid future date and time for the event.");
      return;
    }

    setLoading(true);
    const event = Object.fromEntries(formData.entries());

    try {
      const token = await getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      toast.success("Event created successfully!");
      router.push("/events");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Create Event" }]} />
      <PageHeading
        eyebrow="Bring people together"
        title="Create an event"
        description="Turn an idea into a reason for your community to come together."
        Icon={CalendarPlus}
      />

      <div className="mt-9 grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(16rem,0.75fr)]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium"><Type aria-hidden="true" className="size-4 text-primary" />Event title</label>
              <input id="title" name="title" required placeholder="Give your event a name" className={fieldClassName} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium"><AlignLeft aria-hidden="true" className="size-4 text-primary" />What is it about?</label>
              <textarea id="description" name="description" required rows={5} placeholder="Tell people what you'll do and why they might like to join." className={`${fieldClassName} resize-y`} />
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="flex items-center gap-2 text-sm font-medium"><CalendarDays aria-hidden="true" className="size-4 text-primary" />Date and time</label>
              <input id="date" name="date" type="datetime-local" min={minimumDateTime} required className={fieldClassName} />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium"><MapPin aria-hidden="true" className="size-4 text-primary" />Where will you meet?</label>
              <input id="location" name="location" required placeholder="Add a place or address" className={fieldClassName} />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium"><Tag aria-hidden="true" className="size-4 text-primary" />Choose a cause</label>
              <select id="category" name="category" required defaultValue="" className={fieldClassName}>
                <option value="" disabled>Select a category</option>
                <option value="Cleanup">Cleanup</option>
                <option value="Plantation">Plantation</option>
                <option value="Donation">Donation</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
                <option value="Charity">Charity</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="maxParticipants" className="flex items-center gap-2 text-sm font-medium"><UsersRound aria-hidden="true" className="size-4 text-primary" />Group size</label>
              <input id="maxParticipants" name="maxParticipants" type="number" min="1" required placeholder="e.g. 20 people" className={fieldClassName} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="image" className="flex items-center gap-2 text-sm font-medium"><ImageIcon aria-hidden="true" className="size-4 text-primary" />Event photo link <span className="font-normal text-muted-foreground">· optional</span></label>
              <input id="image" name="image" type="url" placeholder="Paste an image link" className={fieldClassName} />
              <p className="text-xs text-muted-foreground">A photo helps people picture the day.</p>
            </div>
          </div>

          <div className="border-t pt-5">
            <Button type="submit" disabled={loading || !session} className="h-11 w-full sm:w-auto">
              {loading ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <CalendarPlus aria-hidden="true" />}
              {loading ? "Creating event..." : "Create event"}
            </Button>
          </div>
        </form>

        <aside className="rounded-2xl bg-secondary/60 p-6 sm:p-7">
          <span className="flex size-11 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
            <Check aria-hidden="true" className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-semibold">A few things that help</h2>
          <ul className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
            <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />Make the event welcoming to people joining for the first time.</li>
            <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />Be clear about when and where everyone will meet.</li>
            <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />Tell people what to expect and what to bring.</li>
          </ul>
          <div className="mt-7 rounded-xl border bg-background p-4">
            <p className="text-sm font-semibold">Every gathering starts somewhere.</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Thanks for creating a place for people to show up for one another.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
