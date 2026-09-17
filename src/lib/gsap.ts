"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

// Only the plugins the site uses are loaded: every extra plugin is shipped
// to every visitor on every page.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, CustomEase);

  // Signature motion curve for the whole site — a decisive expo-style
  // out-ease. Everything uses this instead of stock power2/back so the
  // site reads with one consistent motion personality.
  CustomEase.create("sky", "M0,0 C0.16,1 0.3,1 1,1");
  // Secondary curve for short UI moves (hovers, taps).
  CustomEase.create("skyShort", "M0,0 C0.4,0 0.2,1 1,1");

  gsap.defaults({ ease: "sky", duration: 0.9 });
}

export { gsap, ScrollTrigger, DrawSVGPlugin, CustomEase };
