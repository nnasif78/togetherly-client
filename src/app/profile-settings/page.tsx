"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Breadcrumbs from "@/components/breadcrumbs";
import PageHeading from "@/components/page-heading";
import { LoaderCircle, Save, Settings } from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const trimmedName = String(formData.get("name") ?? "").trim();
    const trimmedImage = String(formData.get("image") ?? "").trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (trimmedImage) {
      try {
        new URL(trimmedImage);
      } catch {
        toast.error("Enter a valid profile photo link.");
        return;
      }
    }

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage || null,
      });

      if (error) throw new Error(error.message || "Failed to update your profile.");

      toast.success("Profile updated successfully.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return <main className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-6 py-16 text-muted-foreground">Loading your profile...</main>;
  }

  if (!session) {
    return null;
  }

  return (
    <main className="mx-auto min-h-[50vh] max-w-7xl px-6 py-12 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Profile Settings" }]} />
      <PageHeading
        eyebrow="Your account"
        title="Profile settings"
        description="Update the name and photo people see when you take part in Togetherly."
        Icon={Settings}
      />

      <form onSubmit={handleSubmit} className="mt-9 max-w-2xl space-y-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Name</Label>
          <Input id="profile-name" name="name" autoComplete="name" defaultValue={session.user.name} required maxLength={100} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-email">Email address</Label>
          <Input id="profile-email" type="email" value={session.user.email} readOnly disabled />
          <p className="text-sm text-muted-foreground">Your sign-in email can’t be changed here.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-image">Profile photo link</Label>
          <Input id="profile-image" name="image" type="url" autoComplete="url" placeholder="Paste a profile photo link" defaultValue={session.user.image ?? ""} />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Save aria-hidden="true" />}
          {saving ? "Saving profile..." : "Save changes"}
        </Button>
      </form>
    </main>
  );
}
