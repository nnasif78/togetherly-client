
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

type Event = {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants: number;
  image?: string;
};

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
      .then((response) => response.json())
      .then((events: (Event & { _id: string })[]) => {
        const foundEvent = events.find((item) => item._id === id);
        if (foundEvent) {
          setEvent({
            ...foundEvent,
            date: new Date(foundEvent.date).toISOString().slice(0, 16),
          });
        }
      })
      .catch(() => toast.error("Failed to load event."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEvent((previous) => previous ? { ...previous, [e.target.name]: e.target.value } : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;

    setSaving(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  if (loading) return <main className="px-6 py-16 text-center">Loading event...</main>;
  if (!event) return <main className="px-6 py-16 text-center">Event not found.</main>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-bold">Edit Event</h1>
      <p className="mt-2 text-muted-foreground">Update your event information.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Event Title</label>
          <input name="title" value={event.title} onChange={handleChange} required className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea name="description" value={event.description} onChange={handleChange} required rows={4} className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Date and Time</label>
          <input name="date" type="datetime-local" value={event.date} onChange={handleChange} required className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>
          <input name="location" value={event.location} onChange={handleChange} required className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <select name="category" value={event.category} onChange={handleChange} required className="w-full rounded-md border bg-background px-3 py-2">
            <option value="Environment">Environment</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Community">Community</option>
            <option value="Charity">Charity</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Maximum Participants</label>
          <input name="maxParticipants" type="number" min="1" value={event.maxParticipants} onChange={handleChange} required className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Image URL (Optional)</label>
          <input name="image" type="url" value={event.image || ""} onChange={handleChange} className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <button type="submit" disabled={saving} className="w-full rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-50">
          {saving ? "Saving Changes..." : "Update Event"}
        </button>
      </form>
    </main>
  );
}
