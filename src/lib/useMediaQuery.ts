"use client";

import { useSyncExternalStore } from "react";

/* Whether a media query matches, live. Returns null on the server and during
   hydration — the server cannot know the viewport — so a component can render
   one markup for both and let CSS decide until the real answer arrives. */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => null
  );
}
