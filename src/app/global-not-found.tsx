import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import NotFoundContent from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className="light">
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
            Togetherly
          </Link>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center">
          <NotFoundContent />
        </main>
      </body>
    </html>
  );
}
