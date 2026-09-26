import { Card, CardTitle, Page } from "@/components/admin/ui";
import {
  PasswordCard,
  RecoveryCard,
  TwoFactorCard,
} from "@/components/admin/AccountForms";
import { ActionForm } from "@/components/admin/ActionForm";
import { countUnusedRecoveryCodes } from "@/lib/server/account";
import { forgetTrustedDevices } from "@/lib/actions/account";
import { listTrustedDevices } from "@/lib/server/trusted";
import { dateTime } from "@/components/admin/ui";
import { currentAdmin } from "@/lib/server/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const [codesLeft, devices] = await Promise.all([
    countUnusedRecoveryCodes(admin.id),
    listTrustedDevices(admin.id),
  ]);

  /* A browser string is unreadable as-is; the parts people recognise are the
     browser and the platform. */
  const describe = (ua: string) => {
    const browser = /edg/i.test(ua)
      ? "Edge"
      : /chrome/i.test(ua)
        ? "Chrome"
        : /firefox/i.test(ua)
          ? "Firefox"
          : /safari/i.test(ua)
            ? "Safari"
            : "Browser";
    const platform = /android/i.test(ua)
      ? "Android"
      : /iphone|ipad/i.test(ua)
        ? "iPhone or iPad"
        : /mac/i.test(ua)
          ? "Mac"
          : /windows/i.test(ua)
            ? "Windows"
            : "device";
    return `${browser} on ${platform}`;
  };

  return (
    <Page
      eyebrow="Your account"
      title={admin.name}
      lead={`${admin.email} · ${admin.role}`}
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardTitle note={admin.hasTotp ? "on" : "not set"}>Two-factor authentication</CardTitle>
          <TwoFactorCard enrolled={admin.hasTotp} codesLeft={codesLeft} />
        </Card>

        <Card>
          <CardTitle note={codesLeft > 0 ? `${codesLeft} left` : "none"}>Recovery codes</CardTitle>
          <RecoveryCard codesLeft={codesLeft} />
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle>Password</CardTitle>
          <PasswordCard />
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle note={devices.length > 0 ? `${devices.length} remembered` : "none"}>
            Trusted devices
          </CardTitle>
          <p className="mb-4 text-[0.85rem] leading-relaxed text-text/60">
            Browsers that can sign in with your password alone for 30 days. The
            authenticator is skipped on these, and nowhere else.
          </p>

          {devices.length === 0 ? (
            <p className="text-[0.875rem] text-text/45">
              None. Every sign-in asks for a code.
            </p>
          ) : (
            <>
              <ul className="mb-4 flex flex-col">
                {devices.map((device) => (
                  <li
                    key={device.createdAt.toISOString()}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-text/[0.06] py-2.5 last:border-b-0"
                  >
                    <span className="text-[0.9rem] text-text/80">
                      {describe(device.userAgent)}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.06em] text-text/35">
                      trusted {dateTime(device.createdAt)} · expires{" "}
                      {dateTime(device.expiresAt)}
                    </span>
                  </li>
                ))}
              </ul>

              <ActionForm action={forgetTrustedDevices} message="Every device forgotten.">
                <button
                  type="submit"
                  className="rounded-lg border border-text/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text/65 transition-[color,border-color,transform] duration-150 ease-out hover:border-[#b42318] hover:text-[#b42318] active:scale-[0.98]"
                >
                  Forget all devices
                </button>
              </ActionForm>

              <p className="mt-3 text-[0.75rem] leading-relaxed text-text/35">
                The first thing to do if a laptop or phone goes missing. It takes effect
                immediately, not when a session expires.
              </p>
            </>
          )}
        </Card>
      </div>
    </Page>
  );
}
