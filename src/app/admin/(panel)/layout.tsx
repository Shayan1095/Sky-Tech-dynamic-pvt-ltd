import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { AdminNav, AdminNavMobile, type NavItem } from "@/components/admin/AdminNav";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { Toaster } from "@/components/admin/Toaster";
import { currentAdmin } from "@/lib/server/auth";
import { signOut } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

/* Every page inside this group is behind the session check below. Putting it
   in the layout rather than in each page means a new page cannot accidentally
   ship unprotected — the protection is structural, not remembered. */

const NAV: readonly NavItem[] = [
  { href: "/admin", label: "Dashboard", glyph: "01" },
  { href: "/admin/enquiries", label: "Enquiries", glyph: "02" },
  { href: "/admin/clients", label: "Clients", glyph: "03" },
  { href: "/admin/traffic", label: "Traffic", glyph: "04" },
  { href: "/admin/email", label: "Email", glyph: "05" },
  { href: "/admin/prices", label: "Prices", glyph: "06" },
  { href: "/admin/pages", label: "Page Text", glyph: "07" },
  { href: "/admin/mobile", label: "Mobile Layout", glyph: "08" },
  { href: "/admin/settings", label: "Site Details", glyph: "09" },
  { href: "/admin/admins", label: "Access", glyph: "10" },
  { href: "/admin/activity", label: "Activity", glyph: "11" },
];

export default async function PanelLayout({ children, drawer }: LayoutProps<"/admin">) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  /* An account still on its generated password cannot enter the panel at all.
     The screen it is sent to lives outside this group, which is what makes the
     redirect safe: nothing here can loop back into itself, and a new page
     added later inherits the gate without having to remember it. */
  if (admin.mustChangePassword) redirect("/admin/set-password");

  /* Read here so the theme is already in the HTML that is sent. Anything but
     "dark" is light, so a tampered cookie cannot produce a third state. */
  const theme = (await cookies()).get("sky-admin-theme")?.value === "dark" ? "dark" : "light";

  return (
    <Toaster>
    <CommandPalette items={NAV} />
    <div className="adm flex min-h-dvh bg-panel" data-theme={theme}>
      <aside className="sticky top-0 hidden h-dvh w-[15rem] shrink-0 flex-col border-r border-white/[0.06] bg-navy lg:flex">
        <div className="border-b border-white/[0.07] px-6 py-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-cta">Administration</p>
          <p className="mt-2 font-display text-[1.05rem] font-semibold leading-tight tracking-[-0.015em] text-white">
            SKY Tech Dynamic
          </p>
        </div>

        <AdminNav items={NAV} />

        <p className="px-6 pb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/25">
          Ctrl K to search
        </p>

        <div className="border-t border-white/[0.07] p-4">
          <Link
            href="/admin/account"
            className="block truncate text-[0.85rem] font-medium text-white/85 transition-colors duration-200 hover:text-cta"
          >
            {admin.name}
          </Link>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
              {admin.role}
            </p>
            <ThemeToggle initial={theme} />
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="mt-3 w-full rounded-lg border border-white/12 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 transition-[color,border-color,transform] duration-150 ease-out hover:border-white/25 hover:text-white active:scale-[0.98]"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Phones get the same navigation as a scrolling row; the panel is usable
          from a phone because enquiries do not wait for you to reach a desk. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1 border-b border-text/[0.08] bg-navy px-3 py-2.5 lg:hidden">
          <AdminNavMobile items={NAV} />
          <Link
            href="/admin/account"
            className="ml-1 shrink-0 rounded-lg px-2 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45"
          >
            You
          </Link>
          <form action={signOut} className="shrink-0">
            <button
              type="submit"
              className="rounded-lg px-2 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45"
            >
              Out
            </button>
          </form>
        </div>

        <main className="min-w-0 flex-1">{children}</main>
        {/* The intercepted enquiry, when there is one. */}
        {drawer}
      </div>
    </div>
    </Toaster>
  );
}
