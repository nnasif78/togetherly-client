
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const initials = user?.name?.charAt(0).toUpperCase() || "U";

  const linkStyle = "text-sm font-medium text-foreground transition-colors hover:text-primary";
  const dropdownStyle = "block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-4">

        <div className="justify-self-start">
          <Link href="/" className="text-2xl font-bold text-primary">
            Togetherly
          </Link>
        </div>

        <div className="justify-self-center">
          <Link href="/events" className={linkStyle}>
            Upcoming Events
          </Link>
        </div>
        <div className="flex items-center justify-self-end gap-3">
          {!isPending && (
            user ? (
              <>
                <details className="group relative">
                  <summary className="flex cursor-pointer list-none items-center">
                    <div className="relative">
                      {user.image ? (
                        <img src={user.image} alt={user.name || "Profile"} className="size-10 rounded-full border border-border object-cover" />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                          {initials}
                        </div>
                      )}
                      <span className="pointer-events-none absolute right-0 top-12 z-20 hidden whitespace-nowrap rounded-md bg-foreground px-3 py-2 text-xs text-background shadow-md group-hover:block">
                        {user.name}
                      </span>
                    </div>
                  </summary>
                  <div className="absolute right-0 z-30 mt-3 w-52 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg">
                    <div className="border-b border-border px-3 py-2">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link href="/create-event" className={dropdownStyle}>Create Event</Link>
                    <Link href="/manage-events" className={dropdownStyle}>Manage Events</Link>
                    <Link href="/joined-events" className={dropdownStyle}>Joined Events</Link>
                  </div>
                </details>

                <Button size="sm" onClick={handleLogout} className="border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground">Logout</Button>
              </>
            ) : (
              <Button size="sm" onClick={() => router.push("/login")}>Login</Button>
            )
          )}
        </div>

      </div>
    </nav>
  );
}
