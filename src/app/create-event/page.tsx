
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "../../lib/auth-client";
import { getAuthToken } from "../../lib/get-auth-token";

function getLocalDateTimeMin() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

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
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-bold">Create Event</h1>
      <p className="mt-2 text-muted-foreground">Create an event and bring your community together.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Event Title</label>
          <input name="title" required placeholder="Enter event title" className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea name="description" required rows={4} placeholder="Describe your event" className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Date and Time</label>
          <input name="date" type="datetime-local" min={getLocalDateTimeMin()} required className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>
          <input name="location" required placeholder="Enter event location" className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <select name="category" required defaultValue="" className="w-full rounded-md border bg-background px-3 py-2">
            <option value="" disabled>Select a category</option>
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
          <input name="maxParticipants" type="number" min="1" required placeholder="e.g. 50" className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Image URL (Optional)</label>
          <input name="image" type="url" placeholder="https://example.com/image.jpg" className="w-full rounded-md border bg-background px-3 py-2" />
        </div>

        <button type="submit" disabled={loading || !session} className="w-full rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-50">
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </main>
  );
}
