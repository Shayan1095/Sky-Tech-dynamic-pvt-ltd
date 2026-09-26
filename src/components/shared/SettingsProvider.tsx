"use client";

import { createContext, useContext, type ReactNode } from "react";

import { SETTING_DEFAULTS, type SiteSettings } from "@/lib/site-content";

/* Carries the editable site details to the components that show them.

   The footer, the navigation, the contact hero and the contact form all need
   the same phone number and email address. Passing them down by hand would
   mean threading props through every page that renders those components;
   context puts them in one place instead.

   The default value is the hard-coded fallback, so a component rendered
   outside the provider — in a test, or somewhere new — still shows the right
   number rather than nothing at all. */

const SettingsContext = createContext<SiteSettings>(SETTING_DEFAULTS);

export function SettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: ReactNode;
}) {
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
