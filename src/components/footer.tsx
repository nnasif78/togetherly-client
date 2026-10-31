
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CurrentYear from "@/components/current-year";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/35">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <Link href="/" className="text-2xl font-bold text-primary">Togetherly</Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Bringing people together to make a positive difference through community events, volunteering, and social initiatives.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/events" className="hover:text-primary">Upcoming Events</Link></li>
            <li><Link href="/login" className="hover:text-primary">Login</Link></li>
            <li><Link href="/register" className="hover:text-primary">Register</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Get Involved</h3>
          <p className="text-sm text-muted-foreground">
            Discover events, connect with your community, and contribute to meaningful causes.
          </p>
          <Link href="/events" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Explore Events
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-sm text-muted-foreground sm:flex-row">
          <p>© <CurrentYear /> Togetherly. All rights reserved.</p>
          <p>Built to bring communities together.</p>
        </div>
      </div>
    </footer>
  );
}
