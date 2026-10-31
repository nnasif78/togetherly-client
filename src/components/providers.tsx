"use client";

import { useSyncExternalStore, type PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";

const subscribeToMount = () => () => {};
const getMountedSnapshot = () => true;
const getServerSnapshot = () => false;

function ThemeAwareToaster() {
  const { theme } = useTheme();
  const mounted = useSyncExternalStore(subscribeToMount, getMountedSnapshot, getServerSnapshot);

  return (
    <Toaster
      richColors
      position="top-right"
      theme={mounted && theme === "dark" ? "dark" : "light"}
    />
  );
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="togetherly-theme"
    >
      {children}
      <ThemeAwareToaster />
    </NextThemesProvider>
  );
}
