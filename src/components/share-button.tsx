"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ShareButton() {
  const [copying, setCopying] = useState(false);

  const handleShare = async () => {
    setCopying(true);
    try {
      const currentUrl = window.location.href;

      try {
        if (!navigator.clipboard) throw new Error("Clipboard API is unavailable.");
        await navigator.clipboard.writeText(currentUrl);
      } catch {
        const activeElement = document.activeElement;
        const textArea = document.createElement("textarea");
        textArea.value = currentUrl;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand("copy");
        textArea.remove();

        if (activeElement instanceof HTMLElement) activeElement.focus();
        if (!copied) throw new Error("Clipboard access is unavailable in this browser.");
      }

      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Unable to copy the link. Please copy the page URL from your browser.");
    } finally {
      setCopying(false);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={handleShare} disabled={copying}>
      <Share2 aria-hidden="true" />
      {copying ? "Copying link..." : "Share event"}
    </Button>
  );
}
