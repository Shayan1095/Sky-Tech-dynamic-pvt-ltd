"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; glyph: string };

/* Navigation, with the current page marked.

   The active item is worked out by longest match rather than equality, so
   /admin/enquiries/12 still lights up "Enquiries". "/admin" is matched exactly
   — without that it would be the prefix of everything and always look active.

   The marker is a left bar and a change in weight, not a filled block: this
   sits beside a white working area all day, and a heavy highlight would keep
   pulling the eye away from the thing being read. */

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Sections" className="flex flex-1 flex-col gap-1 p-3">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9rem] transition-colors duration-200 ${
              active
                ? "bg-white/[0.08] font-medium text-white"
                : "text-white/60 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-cta transition-opacity duration-200 ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
            <span
              className={`font-mono text-[10px] tracking-[0.1em] transition-colors duration-200 ${
                active ? "text-cta" : "text-white/25 group-hover:text-cta"
              }`}
            >
              {item.glyph}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/* The same list as a scrolling row on phones. The active item is pulled into
   view on load, so the current section is never off-screen behind a swipe. */
export function AdminNavMobile({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            ref={
              active
                ? (node) => {
                    node?.scrollIntoView({ block: "nearest", inline: "center" });
                  }
                : undefined
            }
            className={`shrink-0 rounded-lg px-3 py-2 text-[0.85rem] transition-colors duration-200 ${
              active ? "bg-white/[0.1] font-medium text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
