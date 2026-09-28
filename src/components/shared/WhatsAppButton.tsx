"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/* A way to start a conversation without filling anything in.

   Three things this deliberately does not do:

   It does not appear straight away. A floating button over a hero a visitor
   has been looking at for half a second is an interruption; after a screen of
   scrolling it is an offer. It arrives once the page has been read a little.

   It does not follow anyone into the panel. The admin side is a tool, not a
   shopfront, and /admin is somebody at work.

   It does not sit on top of the contact form. A visitor who has reached the
   form has already chosen how to get in touch, and a button hovering over the
   field they are typing in is just in the way.

   Reduced motion gets the button without the entrance — the button is the
   feature, the fade is not. */

const NUMBER = "923335673810";
const DISPLAY = "+92 333 567 3810";
const MESSAGE = "Hello SKY Tech, I'd like to talk about a project.";

/* Roughly one screen. Far enough that the hero has been passed, near enough
   that it is there before anyone goes looking for it. */
const SHOW_AFTER = 700;

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/contact");

  useEffect(() => {
    if (hidden) return;

    const check = () => setShown(window.scrollY > SHOW_AFTER);
    check();
    /* Passive: this must never be a reason a scroll stutters. */
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [hidden]);

  if (hidden) return null;

  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with SKY Tech on WhatsApp, ${DISPLAY}`}
      data-shown={shown}
      className={[
        "group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full",
        "bg-[#25D366] text-white",
        /* The glow: a wide, soft spill of the brand green, deepening on
           hover. Kept on box-shadow rather than a filter so it composites on
           the GPU and never forces a repaint of what is behind it. */
        "shadow-[0_2px_6px_rgb(18_18_18/0.18),0_10px_26px_-8px_rgb(37_211_102/0.65),0_0_28px_rgb(37_211_102/0.45)]",
        "hover:shadow-[0_2px_6px_rgb(18_18_18/0.2),0_14px_34px_-8px_rgb(37_211_102/0.8),0_0_44px_rgb(37_211_102/0.65)]",
        "motion-safe:transition-[opacity,transform,box-shadow] motion-safe:duration-500",
        "[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]",
        "active:scale-[0.94] sm:bottom-7 sm:right-7 sm:h-15 sm:w-15",
        shown
          ? "pointer-events-auto opacity-100 motion-safe:translate-y-0"
          : "pointer-events-none opacity-0 motion-safe:translate-y-3",
      ].join(" ")}
    >
      {/* A ring that breathes outward, so the button reads as live rather
          than parked. Purely decorative, behind the button, and stopped
          entirely under reduced motion — a pulsing element in the corner of
          the eye is exactly what that setting exists to switch off. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-[waPulse_2.6s_cubic-bezier(0.22,1,0.36,1)_infinite]"
      />

      {/* The mark, drawn rather than loaded, so it costs no request and stays
          crisp at any size. */}
      <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
      </svg>
    </a>
  );
}
