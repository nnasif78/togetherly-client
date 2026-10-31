
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { BookmarkCheck, CalendarDays, ClipboardList, LogIn, LogOut, Moon, Plus, Settings, Sun, SunMoon } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/skeletons";
import LoadingImage from "@/components/loading-image";

const subscribeToMount = () => () => {};
const getMountedSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeToMount, getMountedSnapshot, getServerSnapshot);
  const [loggingOut, setLoggingOut] = useState(false);
  const profileMenuRef = useRef<HTMLDetailsElement>(null);

  const user = session?.user;
  const initials = user?.name?.charAt(0).toUpperCase() || "U";

  const linkStyle = "inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary";
  const dropdownStyle = "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground";
  const closeProfileMenu = () => {
    if (profileMenuRef.current) profileMenuRef.current.open = false;
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authClient.signOut();
      toast.success("You have been logged out.");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">

        <div className="shrink-0">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
            Togetherly
          </Link>
        </div>

        <div className="hidden items-center gap-6 sm:flex">
          <Link href="/events" className={linkStyle}>
            <CalendarDays aria-hidden="true" className="size-4" />
            Upcoming Events
          </Link>
          <Link href="/#initiatives-title" className={linkStyle}>
            <BookmarkCheck aria-hidden="true" className="size-4" />
            Get involved
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={mounted ? (theme === "dark" ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
            title={mounted ? (theme === "dark" ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
          >
            {mounted ? (
              theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />
            ) : (
              <SunMoon aria-hidden="true" />
            )}
          </Button>
          {isPending ? (
            <Skeleton className="size-10 rounded-full" />
          ) : (
            user ? (
              <>
                <details ref={profileMenuRef} className="group relative">
                  <summary aria-label="Open profile menu" className="flex cursor-pointer list-none items-center rounded-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                    <div className="relative">
                      {user.image ? (
                        <LoadingImage src={user.image} alt={user.name || "Profile"} containerClassName="size-10 rounded-full border border-border" className="size-full rounded-full object-cover" />
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
                    <Link href="/create-event" onClick={closeProfileMenu} className={dropdownStyle}><Plus aria-hidden="true" className="size-4" />Create Event</Link>
                    <Link href="/manage-events" onClick={closeProfileMenu} className={dropdownStyle}><ClipboardList aria-hidden="true" className="size-4" />Manage Events</Link>
                    <Link href="/joined-events" onClick={closeProfileMenu} className={dropdownStyle}><BookmarkCheck aria-hidden="true" className="size-4" />Joined Events</Link>
                    <Link href="/profile-settings" onClick={closeProfileMenu} className={dropdownStyle}><Settings aria-hidden="true" className="size-4" />Profile Settings</Link>
                  </div>
                </details>

                <Button size="icon-sm" variant="outline" onClick={handleLogout} disabled={loggingOut} aria-label={loggingOut ? "Logging out" : "Log out"} title={loggingOut ? "Logging out" : "Log out"} className="sm:w-auto sm:px-3">
                  <LogOut aria-hidden="true" />
                  <span className="hidden sm:inline">{loggingOut ? "Logging out..." : "Log out"}</span>
                </Button>
              </>
            ) : (
              <Button size="icon-sm" onClick={() => router.push(`/login?returnTo=${encodeURIComponent(`${window.location.pathname}${window.location.search}${window.location.hash}`)}`)} aria-label="Log in" title="Log in" className="sm:w-auto sm:px-3">
                <LogIn aria-hidden="true" />
                <span className="hidden sm:inline">Log in</span>
              </Button>
            )
          )}
        </div>

      </div>
    </nav>
  );
}
