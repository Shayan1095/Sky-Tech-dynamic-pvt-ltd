import { asc, sql } from "drizzle-orm";

import InviteForm from "@/components/admin/InviteForm";
import { Card, CardTitle, Page, dateTime } from "@/components/admin/ui";
import { setActive, setRole, signOutEverywhere } from "@/lib/actions/admins";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { adminSessions, adminUsers } from "@/lib/server/schema";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const me = await currentAdmin();
  const handle = db();

  const rows = handle
    ? await handle
        .select({
          id: adminUsers.id,
          email: adminUsers.email,
          name: adminUsers.name,
          role: adminUsers.role,
          isActive: adminUsers.isActive,
          hasTotp: sql<number>`${adminUsers.totpSecret} IS NOT NULL`,
          failedAttempts: adminUsers.failedAttempts,
          mustChangePassword: adminUsers.mustChangePassword,
          /* Whether the account is locked is decided by the database, using
             the same clock the sign-in check uses. Comparing against this
             machine's clock during render could disagree with it. */
          locked: sql<number>`${adminUsers.lockedUntil} > UTC_TIMESTAMP()`,
          lastLoginAt: adminUsers.lastLoginAt,
          sessions: sql<number>`(
            SELECT COUNT(*) FROM ${adminSessions}
            WHERE ${adminSessions.userId} = ${adminUsers.id}
              AND ${adminSessions.expiresAt} > UTC_TIMESTAMP()
          )`,
        })
        .from(adminUsers)
        .orderBy(asc(adminUsers.email))
    : [];

  const isOwner = me?.role === "owner";
  const activeOwners = rows.filter((r) => r.role === "owner" && r.isActive === 1).length;

  return (
    <Page
      eyebrow="Access"
      title="Administrators"
      lead={
        isOwner
          ? "Who can sign in, and what they are allowed to do."
          : "Who can sign in. Only an owner can change these."
      }
    >
      <div className="flex flex-col gap-3">
        <Card className="p-0">
          <ul className="flex flex-col">
            {rows.map((row) => {
              const self = row.id === me?.id;
              const lastOwner = row.role === "owner" && activeOwners <= 1;
              const locked = Number(row.locked) === 1;

              return (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-text/[0.06] px-5 py-4 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
                        {row.name}
                      </span>
                      <span className="rounded-full border border-text/15 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-text/55">
                        {row.role}
                      </span>
                      {row.isActive !== 1 && (
                        <span className="rounded-full border border-text/12 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-text/40">
                          deactivated
                        </span>
                      )}
                      {self && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                          you
                        </span>
                      )}
                      {row.mustChangePassword === 1 && (
                        <span className="rounded-full border border-[#b06000]/30 bg-[#b06000]/[0.06] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#b06000]">
                          not signed in yet
                        </span>
                      )}
                    </div>

                    <p className="mt-1 truncate text-[0.85rem] text-text/50">{row.email}</p>

                    <p className="mt-1 font-mono text-[10px] tracking-[0.06em] text-text/35">
                      {Number(row.hasTotp) === 1 ? "2FA on" : "2FA NOT SET"}
                      {" · "}
                      {row.lastLoginAt ? `last in ${dateTime(row.lastLoginAt)}` : "never signed in"}
                      {Number(row.sessions) > 0 && ` · ${row.sessions} active session(s)`}
                      {locked && " · LOCKED OUT"}
                      {row.failedAttempts > 0 && ` · ${row.failedAttempts} failed attempt(s)`}
                    </p>
                  </div>

                  {isOwner && !self && (
                    <div className="flex flex-wrap items-center gap-2">
                      <form action={setRole}>
                        <input type="hidden" name="id" value={row.id} />
                        <input
                          type="hidden"
                          name="role"
                          value={row.role === "owner" ? "editor" : "owner"}
                        />
                        <button
                          type="submit"
                          disabled={row.role === "owner" && lastOwner}
                          className="rounded-lg border border-text/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text/60 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          Make {row.role === "owner" ? "editor" : "owner"}
                        </button>
                      </form>

                      {Number(row.sessions) > 0 && (
                        <form action={signOutEverywhere}>
                          <input type="hidden" name="id" value={row.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-text/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text/60 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.98]"
                          >
                            Sign out everywhere
                          </button>
                        </form>
                      )}

                      <form action={setActive}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="active" value={row.isActive === 1 ? "0" : "1"} />
                        <button
                          type="submit"
                          disabled={row.isActive === 1 && lastOwner}
                          className="rounded-lg border border-text/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text/60 transition-[color,border-color,transform] duration-150 ease-out hover:border-[#b42318] hover:text-[#b42318] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          {row.isActive === 1 ? "Deactivate" : "Reactivate"}
                        </button>
                      </form>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        {isOwner ? (
          <Card>
            <CardTitle>Add an administrator</CardTitle>
            <p className="mb-4 text-[0.85rem] leading-relaxed text-text/55">
              Creates the account, generates a temporary password and an authenticator,
              and shows all of it once.
            </p>
            <InviteForm />
          </Card>
        ) : null}

        <Card>
          <CardTitle>If someone is locked out</CardTitle>
          <p className="text-[0.85rem] leading-relaxed text-text/60">
            An account can also be reset from the command line, which is the way back
            when the last owner has lost both their phone and their recovery codes:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-text/[0.09] bg-panel px-4 py-3 font-mono text-[0.8rem] text-text/75">
            npm run admin:create
          </pre>
          <p className="mt-3 text-[0.8rem] leading-relaxed text-text/45">
            Run with an email that already exists, it resets that account, issues a new
            QR code, and signs it out everywhere.
          </p>
        </Card>

        {!isOwner && (
          <p className="text-[0.8rem] leading-relaxed text-text/45">
            You are signed in as an editor, so this list is read-only.
          </p>
        )}
      </div>
    </Page>
  );
}
