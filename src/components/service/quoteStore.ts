"use client";

import { useSyncExternalStore } from "react";

/* The visitor's quote in progress: the package they have chosen and the
   add-ons they have ticked.

   Four separate sections read it — the package chooser, the quote builder,
   the desktop section bar and the phone quote bar — so it lives in one small
   external store rather than in any one component. Choosing a package in the
   chooser updates the builder's total, the bars' figures and the link to the
   contact form in the same render.

   The state is scoped to the page's slug: moving to another service page
   starts a fresh quote rather than carrying one service's tier across. */

export type Quote = { slug: string; tierId: string; addOns: readonly string[] };

let state: Quote = { slug: "", tierId: "", addOns: [] };
const listeners = new Set<() => void>();
const serverSnapshots = new Map<string, Quote>();

const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function ensure(slug: string, defaultTier: string) {
  if (state.slug !== slug) state = { slug, tierId: defaultTier, addOns: [] };
}

export const quote = {
  setTier(slug: string, tierId: string) {
    if (state.slug === slug && state.tierId === tierId) return;
    /* The first write for a page also has to notify: before it, readers
       were shown the default snapshot, not this state. */
    const base = state.slug === slug ? state : { slug, tierId, addOns: [] };
    state = { ...base, tierId };
    emit();
  },
  toggleAddOn(slug: string, defaultTier: string, name: string) {
    ensure(slug, defaultTier);
    const has = state.addOns.includes(name);
    state = { ...state, addOns: has ? state.addOns.filter((n) => n !== name) : [...state.addOns, name] };
    emit();
  },
  /* Adds without toggling — for links that say "include this". */
  addAddOn(slug: string, defaultTier: string, name: string) {
    ensure(slug, defaultTier);
    if (state.addOns.includes(name)) return;
    state = { ...state, addOns: [...state.addOns, name] };
    emit();
  },
};

/* The current quote for this page. The server (and the first client render)
   sees the default — the first package, no add-ons — so hydration matches. */
export function useQuote(slug: string, defaultTier: string): Quote {
  return useSyncExternalStore(
    subscribe,
    () => (state.slug === slug ? state : defaultQuote(slug, defaultTier)),
    () => defaultQuote(slug, defaultTier)
  );
}

function defaultQuote(slug: string, defaultTier: string): Quote {
  const key = `${slug}:${defaultTier}`;
  let snap = serverSnapshots.get(key);
  if (!snap) {
    snap = { slug, tierId: defaultTier, addOns: [] };
    serverSnapshots.set(key, snap);
  }
  return snap;
}
