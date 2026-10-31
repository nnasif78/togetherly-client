
"use client";

import { Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "../../../lib/auth-client";
import { getAuthToken } from "../../../lib/get-auth-token";
import { AlignLeft, CalendarDays, Image as ImageIcon, LoaderCircle, MapPin, Save, Tag, Type, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeading from "@/components/page-heading";
import Breadcrumbs from "@/components/breadcrumbs";
import { createEventSlug } from "@/lib/event-slug";
import { EventFormSkeleton } from "@/components/skeletons";

function getLocalDateTimeMin() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

const fieldClassName = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const subscribeToDate = () => () => {};
const getServerDate = () => "";

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants: number;
  image?: string;
  createdBy: string;
};

export default function EditEventPage() {
  return (
    <Suspense fallback={<EventFormSkeleton />}>
      <EditEventContent />
    </Suspense>
  );
}

function EditEventContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [settledRequestKey, setSettledRequestKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState(false);
  const minimumDateTime = useSyncExternalStore(subscribeToDate, getLocalDateTimeMin, getServerDate);
  const requestKey = `${id}:${session?.user.id ?? ""}`;

  useEffect(() => {
    if (isPending) return;

    if (!session?.user.id) {
      router.replace("/login");
      return;
    }

    const isMongoId = /^[a-f\d]{24}$/i.test(id);
    const eventEndpoint = isMongoId
      ? `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/events/by-slug/${encodeURIComponent(id)}`;

    fetch(eventEndpoint)
      .then((response) => {
        if (!response.ok) throw new Error("Event not found.");
        return response.json();
      })
      .then((foundEvent: Event) => {
        if (foundEvent.createdBy !== session.user.id) {
          setUnauthorized(true);
          return;
        }

        setEvent({
          ...foundEvent,
          date: new Date(foundEvent.date).toISOString().slice(0, 16),
        });
        const canonicalSlug = createEventSlug(foundEvent);
        if (isMongoId) router.replace(`/edit-event/${canonicalSlug}`);
        else if (id !== canonicalSlug) router.replace(`/edit-event/${canonicalSlug}`);
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Failed to load event.");
        toast.error("Failed to load event.");
      })
      .finally(() => setSettledRequestKey(`${id}:${session.user.id}`));
  }, [id, session?.user.id, isPending, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEvent((previous) => previous ? { ...previous, [e.target.name]: e.target.value } : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;

    const eventDate = new Date(event.date);
    if (!Number.isFinite(eventDate.getTime()) || eventDate.getTime() <= Date.now()) {
      toast.error("Please choose a valid future date and time for the event.");
      return;
    }

    setSaving(true);

    try {
      const token = await getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      toast.success("Event updated successfully!");
      router.push("/manage-events");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || settledRequestKey !== requestKey) return <EventFormSkeleton />;

  if (unauthorized) {
    return <main className="px-6 py-16 text-center">You are not authorized to edit this event.</main>;
  }

  if (!event) return <main className="mx-auto max-w-7xl px-6 py-16 text-center" role={loadError ? "alert" : undefined}>{loadError || "Event not found."}</main>;

  return (
    <main className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Manage Events", href: "/manage-events" }, { label: "Edit Event" }]} />
      <PageHeading
        eyebrow="Keep everyone in the loop"
        title="Edit your event"
        description="Update the details so people know what to expect."
        Icon={Save}
      />

      <form onSubmit={handleSubmit} className="mt-9 space-y-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium"><Type aria-hidden="true" className="size-4 text-primary" />Event title</label>
          <input id="title" name="title" value={event.title} onChange={handleChange} required className={fieldClassName} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium"><AlignLeft aria-hidden="true" className="size-4 text-primary" />Description</label>
          <textarea id="description" name="description" value={event.description} onChange={handleChange} required rows={5} className={`${fieldClassName} resize-y`} />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="flex items-center gap-2 text-sm font-medium"><CalendarDays aria-hidden="true" className="size-4 text-primary" />Date and time</label>
          <input id="date" name="date" type="datetime-local" min={minimumDateTime} value={event.date} onChange={handleChange} required className={fieldClassName} />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium"><MapPin aria-hidden="true" className="size-4 text-primary" />Location</label>
          <input id="location" name="location" value={event.location} onChange={handleChange} required className={fieldClassName} />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium"><Tag aria-hidden="true" className="size-4 text-primary" />Category</label>
          <select id="category" name="category" value={event.category} onChange={handleChange} required className={fieldClassName}>
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
          <label htmlFor="maxParticipants" className="flex items-center gap-2 text-sm font-medium"><UsersRound aria-hidden="true" className="size-4 text-primary" />Maximum participants</label>
          <input id="maxParticipants" name="maxParticipants" type="number" min="1" value={event.maxParticipants} onChange={handleChange} required className={fieldClassName} />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <p className="flex items-center gap-2 text-sm font-medium">
            <ImageIcon aria-hidden="true" className="size-4 text-primary" />
            Event photo
            <span className="font-normal text-muted-foreground">· optional</span>
          </p>
          {event.image && !editingImage && (
            <p className="text-sm text-muted-foreground">A photo is currently attached to this event.</p>
          )}
          {editingImage ? (
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm text-muted-foreground">Photo link</label>
              <input id="image" name="image" type="url" value={event.image || ""} onChange={handleChange} placeholder="Paste an image link" className={fieldClassName} />
            </div>
          ) : (
            <Button type="button" variant="outline" onClick={() => setEditingImage(true)}>
              <ImageIcon aria-hidden="true" />
              {event.image ? "Change photo link" : "Add photo link"}
            </Button>
          )}
        </div>
        </div>

        <div className="border-t pt-5">
        <Button type="submit" disabled={saving} className="h-11 w-full sm:w-auto">
          {saving ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}
          {saving ? "Saving changes..." : "Update event"}
        </Button>
        </div>
      </form>
    </main>
  );
}
