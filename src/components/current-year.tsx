"use client";

import { useSyncExternalStore } from "react";

const subscribeToYear = () => () => {};
const getCurrentYear = () => String(new Date().getFullYear());
const getServerYear = () => "";

export default function CurrentYear() {
  const year = useSyncExternalStore(subscribeToYear, getCurrentYear, getServerYear);

  return <time>{year}</time>;
}
