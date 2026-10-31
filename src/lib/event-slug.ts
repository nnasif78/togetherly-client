type EventSlugData = {
  title: string;
  date: string | Date;
};

export function slugifyEventTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createEventSlug(event: EventSlugData) {
  const titleSlug = slugifyEventTitle(event.title) || "community-event";
  const date = new Date(event.date);
  if (!Number.isFinite(date.getTime())) return titleSlug;

  const datePart = date.toISOString().slice(0, 10);
  return `${titleSlug}-${datePart}`;
}
