import "server-only";

/* ---------------------------------------------------------------------------
   Server-only configuration.

   Every value is supplied by the environment: hPanel's "Environment
   Variables" panel in production, .env.local in development. Nothing here is
   ever committed, logged, or returned to the browser.

   Each group is deliberately optional. This is a marketing site first, and it
   has to build and serve with no database and no mail account — on a fresh
   clone, in CI, and during a deploy that has not been configured yet. When a
   group is missing the contact form reports "unavailable" instead of
   pretending a message was delivered.

   These are read through functions rather than module constants so the value
   is whatever the running process has, not whatever was present when the
   bundle was built.
   ------------------------------------------------------------------------ */

function read(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

/** mysql://user:password@host:3306/database */
export const databaseUrl = () => read("DATABASE_URL");
export const hasDatabase = () => databaseUrl().length > 0;

export type MailConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  to: string;
};

/* Hostinger's mailboxes: smtp.hostinger.com, port 465, implicit TLS.
   MAIL_FROM must be a mailbox that exists on the domain (info@skytech.com.pk)
   or the message is rejected as a forgery by the receiving server. */
export function mailConfig(): MailConfig | null {
  const host = read("SMTP_HOST");
  const user = read("SMTP_USER");
  const password = read("SMTP_PASSWORD");
  const to = read("MAIL_TO");
  if (!host || !user || !password || !to) return null;
  return {
    host,
    port: Number(read("SMTP_PORT")) || 465,
    user,
    password,
    from: read("MAIL_FROM") || user,
    to,
  };
}

export const hasMail = () => mailConfig() !== null;

/* Visitor IP addresses are never stored. They are hashed with this secret so
   the same visitor can be rate limited without the address itself being
   recoverable from the database. Rotating it simply resets the counters. */
export const ipSalt = () => read("IP_SALT");

/* Shared secret for the scheduled mail-retry endpoint. Empty disables it. */
export const taskToken = () => read("TASK_TOKEN");
