import {
  datetime,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/* ---------------------------------------------------------------------------
   Database schema (MySQL 8 / MariaDB, utf8mb4).

   This file is the single definition of the tables. The SQL that creates them
   is generated from it into drizzle/ and applied through phpMyAdmin, because
   shared hosting has no shell to run a migration command from.

   Two rules hold throughout:

   1. An enquiry is a permanent record. Nothing deletes one — the admin panel
      archives instead, so a lead can never be lost to a mis-click.
   2. No personal data is stored that the business does not need in order to
      reply. Visitor IP addresses are hashed, never kept.
   ------------------------------------------------------------------------ */

export const enquiries = mysqlTable(
  "enquiries",
  {
    id: int("id").autoincrement().primaryKey(),

    /* Short human reference ("SKY-8F3K2P"), quoted in the notification email
       so a reply thread can be tied back to a row. */
    reference: varchar("reference", { length: 24 }).notNull().unique(),

    // Step 1 of the form — all required.
    name: varchar("name", { length: 100 }).notNull(),
    company: varchar("company", { length: 120 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 30 }).notNull(),
    country: varchar("country", { length: 80 }).notNull(),

    // Step 2 — all optional, stored as sent (empty string, never NULL).
    service: varchar("service", { length: 60 }).notNull(),
    details: text("details").notNull(),
    budget: varchar("budget", { length: 80 }).notNull(),
    budgetCustom: varchar("budget_custom", { length: 80 }).notNull(),
    timeline: varchar("timeline", { length: 80 }).notNull(),

    /* Where the enquiry came from: "package", "consultation", or "" for an
       ordinary one. Validated against the allowed list before it is stored. */
    enquiryType: varchar("enquiry_type", { length: 20 }).notNull(),

    /* A multi-service combination chosen on the Services page, and the add-ons
       ticked in a service page's quote builder — both re-checked server-side,
       so what is stored is what the site offers, not what was posted. */
    packageName: varchar("package_name", { length: 160 }).notNull(),
    addOns: text("add_ons").notNull(),

    /* The price the visitor was looking at when they submitted, recomputed
       here from the package and add-ons rather than taken from the form. */
    estimate: varchar("estimate", { length: 120 }).notNull(),

    /* The same figure as numbers, recorded at the moment of submission. The
       string above is what the visitor was shown; these are what the
       dashboard adds up. */
    estimateOnce: int("estimate_once").notNull().default(0),
    estimateMonthly: int("estimate_monthly").notNull().default(0),
    estimateYearly: int("estimate_yearly").notNull().default(0),
    /* True when the quoted figure was open-ended ("$2,500+"), so a total
       built from it is known to be a floor rather than a price. */
    estimateOpen: int("estimate_open").notNull().default(0),

    status: mysqlEnum("status", ["new", "read", "replied", "archived"])
      .notNull()
      .default("new"),
    adminNotes: text("admin_notes"),

    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
    userAgent: varchar("user_agent", { length: 255 }).notNull(),

    createdAt: datetime("created_at").notNull(),
    updatedAt: datetime("updated_at").notNull(),
  },
  (t) => [
    // The inbox lists newest first, filtered by status.
    index("enquiries_status_created_idx").on(t.status, t.createdAt),
    index("enquiries_created_idx").on(t.createdAt),
  ]
);

/* ---------------------------------------------------------------------------
   Outgoing mail.

   The enquiry is written first and the email is queued second, so a mail
   outage can never lose a lead — it only delays the notification. Sending is
   attempted immediately; anything that fails is retried, with the delay
   growing after each attempt.
   ------------------------------------------------------------------------ */
export const emailQueue = mysqlTable(
  "email_queue",
  {
    id: int("id").autoincrement().primaryKey(),
    enquiryId: int("enquiry_id"),
    clientId: int("client_id"),
    /* Which admin pressed send; null for mail the system generated itself. */
    sentBy: int("sent_by"),
    /* notification - the internal alert when an enquiry arrives
       reply        - a message an admin wrote to a customer */
    kind: mysqlEnum("kind", ["notification", "reply"]).notNull().default("notification"),
    toAddress: varchar("to_address", { length: 254 }).notNull(),
    replyTo: varchar("reply_to", { length: 254 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    bodyText: text("body_text").notNull(),
    status: mysqlEnum("status", ["pending", "sent", "failed"])
      .notNull()
      .default("pending"),
    attempts: int("attempts").notNull().default(0),
    lastError: varchar("last_error", { length: 500 }).notNull(),
    nextAttemptAt: datetime("next_attempt_at").notNull(),
    createdAt: datetime("created_at").notNull(),
    sentAt: datetime("sent_at"),
  },
  (t) => [index("email_queue_due_idx").on(t.status, t.nextAttemptAt)]
);

/* ---------------------------------------------------------------------------
   Rate limiting.

   Kept in the database rather than in memory because the process restarts on
   every deploy, and because an in-memory counter protects nothing once there
   is more than one process.
   ------------------------------------------------------------------------ */
export const rateLimits = mysqlTable("rate_limits", {
  bucket: varchar("bucket", { length: 120 }).primaryKey(),
  hits: int("hits").notNull().default(0),
  windowStartedAt: datetime("window_started_at").notNull(),
});

/* ---------------------------------------------------------------------------
   Administration.

   Three tables, and the separation between them is deliberate. Credentials
   live in admin_users and are never readable — the password is a scrypt hash
   and the 2FA secret is only ever compared, never displayed after enrolment.
   Sessions are separate so a single device can be signed out without touching
   the account. The audit log is append-only: it exists to answer "who changed
   this, and when", including when the answer is inconvenient.
   ------------------------------------------------------------------------ */

export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),

  /* scrypt, as "scrypt$N$r$p$salt$hash". The parameters travel with the hash
     so the cost can be raised later without invalidating existing passwords. */
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),

  /* Base32 TOTP secret. Null until the admin completes enrolment, which they
     are forced through on first sign-in. */
  totpSecret: varchar("totp_secret", { length: 64 }),

  /* The last accepted TOTP step, so a code cannot be replayed inside its own
     30-second window by anyone who observes it. */
  totpLastStep: int("totp_last_step"),

  /* A secret generated for enrolment but not yet proved. It only becomes the
     real one once a code generated from it has been entered correctly —
     otherwise a mis-scanned QR would lock the account out of itself. */
  pendingTotpSecret: varchar("pending_totp_secret", { length: 64 }),

  role: mysqlEnum("role", ["owner", "editor"]).notNull().default("editor"),
  isActive: int("is_active").notNull().default(1),

  /* Set when an owner created the account with a temporary password. Until it
     is cleared the panel lets that person do exactly one thing: choose their
     own password. An account whose password someone else still knows is not
     yet that person's account. */
  mustChangePassword: int("must_change_password").notNull().default(0),

  /* Consecutive failures and the lockout they trigger. Counted per account,
     not per IP, so a distributed attempt is slowed just as much. */
  failedAttempts: int("failed_attempts").notNull().default(0),
  lockedUntil: datetime("locked_until"),

  lastLoginAt: datetime("last_login_at"),
  createdAt: datetime("created_at").notNull(),
  updatedAt: datetime("updated_at").notNull(),
});

export const adminSessions = mysqlTable(
  "admin_sessions",
  {
    /* SHA-256 of the cookie value. The cookie itself is never stored, so a
       leaked database backup cannot be used to impersonate a signed-in
       admin. */
    tokenHash: varchar("token_hash", { length: 64 }).primaryKey(),
    userId: int("user_id").notNull(),
    expiresAt: datetime("expires_at").notNull(),
    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
    userAgent: varchar("user_agent", { length: 255 }).notNull(),
    createdAt: datetime("created_at").notNull(),
  },
  (t) => [index("admin_sessions_user_idx").on(t.userId, t.expiresAt)]
);

export const auditLog = mysqlTable(
  "audit_log",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id"),
    /* Who it was at the time. Kept as text so the entry still reads correctly
       after an account is renamed or removed. */
    actor: varchar("actor", { length: 254 }).notNull(),
    action: varchar("action", { length: 60 }).notNull(),
    target: varchar("target", { length: 120 }).notNull(),
    detail: varchar("detail", { length: 500 }).notNull(),
    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
    createdAt: datetime("created_at").notNull(),
  },
  (t) => [index("audit_log_created_idx").on(t.createdAt)]
);

/* ---------------------------------------------------------------------------
   Clients and the work they buy.

   An enquiry is an event: somebody asked something once. A client is a
   relationship that continues. Keeping them as separate tables means an
   enquiry can be converted without being consumed — the original message,
   exactly as it was sent, stays readable years later next to the account it
   became.

   Money is stored as numbers, not as the display strings the site shows.
   "$650 + $100/month" is correct for a visitor and useless for arithmetic; a
   total nobody can add up is not a figure a business can run on.
   ------------------------------------------------------------------------ */

export const clients = mysqlTable(
  "clients",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    company: varchar("company", { length: 120 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 30 }).notNull(),
    country: varchar("country", { length: 80 }).notNull(),

    /* lead      — in conversation, nothing agreed
       active    — paying for something right now
       past      — worked together before, nothing running
       lost      — went elsewhere, kept so the history is honest */
    status: mysqlEnum("status", ["lead", "active", "past", "lost"])
      .notNull()
      .default("lead"),

    /* The enquiry this came from, when it came from one. Null for a client
       added by hand — a referral, or someone who phoned. */
    sourceEnquiryId: int("source_enquiry_id"),

    notes: text("notes"),
    createdAt: datetime("created_at").notNull(),
    updatedAt: datetime("updated_at").notNull(),
  },
  (t) => [
    index("clients_status_idx").on(t.status, t.createdAt),
    index("clients_email_idx").on(t.email),
  ]
);

export const clientServices = mysqlTable(
  "client_services",
  {
    id: int("id").autoincrement().primaryKey(),
    clientId: int("client_id").notNull(),

    service: varchar("service", { length: 60 }).notNull(),
    packageName: varchar("package_name", { length: 160 }).notNull(),

    /* The agreed figure, and how often it is charged. Both are needed: $500
       once and $500 a month are the same number and a different business. */
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    billing: mysqlEnum("billing", ["once", "monthly", "yearly"])
      .notNull()
      .default("once"),

    status: mysqlEnum("status", ["proposed", "active", "completed", "cancelled"])
      .notNull()
      .default("proposed"),

    startedOn: datetime("started_on"),
    endsOn: datetime("ends_on"),
    notes: text("notes"),
    createdAt: datetime("created_at").notNull(),
    updatedAt: datetime("updated_at").notNull(),
  },
  (t) => [index("client_services_client_idx").on(t.clientId, t.status)]
);

/* ---------------------------------------------------------------------------
   Editable site details.

   A key/value table rather than a column per setting, so adding a social
   profile or a second phone number later is a row, not a migration. The site
   only ever applies keys it knows about, so a stale row is inert rather than
   dangerous.
   ------------------------------------------------------------------------ */
export const siteSettings = mysqlTable("site_settings", {
  settingKey: varchar("setting_key", { length: 60 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: datetime("updated_at").notNull(),
  updatedBy: int("updated_by"),
});

/* ---------------------------------------------------------------------------
   Price overrides.

   The service pages, their packages and every word of their copy stay in the
   repository, where they are reviewable and versioned. What changes often —
   the prices — is stored here instead, as an override keyed by the service and
   the package it belongs to.

   Only the price is overridable, deliberately. Changing a price is a business
   decision made weekly; adding or removing a package changes the shape of a
   page, and that belongs in a reviewed change rather than in a text box. A row
   whose package no longer exists is ignored rather than applied, and the admin
   panel shows it as orphaned instead of silently dropping it.
   ------------------------------------------------------------------------ */
export const servicePrices = mysqlTable(
  "service_prices",
  {
    id: int("id").autoincrement().primaryKey(),
    /* The service exactly as the contact form names it, e.g. "Web
       Development" — the one name both the page and the form agree on. */
    serviceName: varchar("service_name", { length: 60 }).notNull(),
    packageName: varchar("package_name", { length: 160 }).notNull(),
    /* Written as it is displayed: "$299", "$25/video", "Custom Quote". The
       site parses this for totals, so it stays in the site's own format
       rather than becoming a number that loses its unit. */
    price: varchar("price", { length: 40 }).notNull(),
    updatedAt: datetime("updated_at").notNull(),
    updatedBy: int("updated_by"),
  },
  (t) => [uniqueIndex("service_prices_item_idx").on(t.serviceName, t.packageName)]
);

/* ---------------------------------------------------------------------------
   Page text overrides.

   The same arrangement as prices: the content files hold the writing, this
   table holds the changes made since. An empty table means the site reads
   exactly as it was written and reviewed.

   The field key is a path into the page — "hero.h1", "faq.2.answer" — so a
   change is tied to the thing it changed rather than to a position in a form.
   A key that no longer exists on a page is ignored, which is what makes it
   safe to edit copy in one release and restructure a page in the next.
   ------------------------------------------------------------------------ */
export const pageText = mysqlTable(
  "page_text",
  {
    id: int("id").autoincrement().primaryKey(),
    /* The service slug, e.g. "web-development". */
    pageKey: varchar("page_key", { length: 80 }).notNull(),
    fieldKey: varchar("field_key", { length: 120 }).notNull(),
    value: text("value").notNull(),
    updatedAt: datetime("updated_at").notNull(),
    updatedBy: int("updated_by"),
  },
  (t) => [uniqueIndex("page_text_field_idx").on(t.pageKey, t.fieldKey)]
);

/* ---------------------------------------------------------------------------
   Recovery codes.

   Ten one-time codes, issued when an authenticator is enrolled. Each is
   accepted in place of a six-digit code, exactly once. They exist for the
   case the whole design otherwise has no answer to: the phone is gone.

   Stored as SHA-256 rather than scrypt. A recovery code is 100+ bits of
   randomness this system generated, not a phrase a person chose, so there is
   nothing to guess and no dictionary to run — and verification has to compare
   against ten rows, which at scrypt's cost would take seconds.
   ------------------------------------------------------------------------ */
export const adminRecoveryCodes = mysqlTable(
  "admin_recovery_codes",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull(),
    codeHash: varchar("code_hash", { length: 64 }).notNull(),
    usedAt: datetime("used_at"),
    createdAt: datetime("created_at").notNull(),
  },
  (t) => [index("admin_recovery_user_idx").on(t.userId, t.usedAt)]
);

/* ---------------------------------------------------------------------------
   Password resets.

   The emailed link carries a random token; only its hash is stored, so the
   table cannot be used to forge one. A reset still requires a second factor —
   an authenticator code or a recovery code — because an email account is not
   proof of identity, and without that check anyone who reaches the mailbox
   owns the admin panel.
   ------------------------------------------------------------------------ */
export const passwordResets = mysqlTable(
  "password_resets",
  {
    tokenHash: varchar("token_hash", { length: 64 }).primaryKey(),
    userId: int("user_id").notNull(),
    expiresAt: datetime("expires_at").notNull(),
    usedAt: datetime("used_at"),
    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
    createdAt: datetime("created_at").notNull(),
  },
  (t) => [index("password_resets_user_idx").on(t.userId, t.expiresAt)]
);

/* ---------------------------------------------------------------------------
   Section visibility.

   Which sections of a page are shown on phones. The section is still rendered
   and still in the HTML — it is hidden with CSS — so desktop output is
   untouched, there is no hydration mismatch, and search engines still see the
   content. Removing it from the markup would cost all three.
   ------------------------------------------------------------------------ */
export const sectionVisibility = mysqlTable(
  "section_visibility",
  {
    id: int("id").autoincrement().primaryKey(),
    pageKey: varchar("page_key", { length: 80 }).notNull(),
    sectionKey: varchar("section_key", { length: 60 }).notNull(),
    /* Only "mobile" today. Stored rather than assumed so a tablet or desktop
       rule can be added without a migration. */
    device: varchar("device", { length: 20 }).notNull(),
    hidden: int("hidden").notNull().default(0),
    updatedAt: datetime("updated_at").notNull(),
    updatedBy: int("updated_by"),
  },
  (t) => [uniqueIndex("section_visibility_idx").on(t.pageKey, t.sectionKey, t.device)]
);

/* ---------------------------------------------------------------------------
   Visitor analytics.

   First-party and deliberately thin. No third-party script, which means no
   cookie banner to consent to, nothing sent to another company, and no
   weight added to a page that has a speed promise on it.

   What is stored is a count, not a person. The visitor hash includes the day,
   so the same browser produces a different value tomorrow: it can answer "how
   many people came on Tuesday" and cannot answer "did this person come back",
   which is the honest trade for not asking permission.
   ------------------------------------------------------------------------ */
export const pageViews = mysqlTable(
  "page_views",
  {
    id: int("id").autoincrement().primaryKey(),
    day: varchar("day", { length: 10 }).notNull(),
    path: varchar("path", { length: 255 }).notNull(),
    /* Host only — "google.com", not the full URL someone came from, which can
       carry a search term or a private address. */
    referrer: varchar("referrer", { length: 120 }).notNull(),
    device: mysqlEnum("device", ["mobile", "desktop"]).notNull(),
    /* Rotates daily. Not reversible, not stable, not a profile. */
    visitorHash: varchar("visitor_hash", { length: 64 }).notNull(),
    createdAt: datetime("created_at").notNull(),
  },
  (t) => [
    index("page_views_day_idx").on(t.day),
    index("page_views_path_idx").on(t.day, t.path),
  ]
);

/* ---------------------------------------------------------------------------
   Trusted devices.

   A browser that has already proved a second factor can be remembered, so the
   authenticator is asked for once a month rather than every single sign-in.
   The password is still required every time — only the second factor is
   skipped, and only on a device that earned it.

   The cookie holds a random token and the table holds its SHA-256, so a
   stolen database cannot be turned into a trusted browser. Anything here can
   be revoked from the account screen, which is the first thing to reach for
   when a laptop goes missing.
   ------------------------------------------------------------------------ */
export const trustedDevices = mysqlTable(
  "trusted_devices",
  {
    tokenHash: varchar("token_hash", { length: 64 }).primaryKey(),
    userId: int("user_id").notNull(),
    expiresAt: datetime("expires_at").notNull(),
    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
    userAgent: varchar("user_agent", { length: 255 }).notNull(),
    lastUsedAt: datetime("last_used_at"),
    createdAt: datetime("created_at").notNull(),
  },
  (t) => [index("trusted_devices_user_idx").on(t.userId, t.expiresAt)]
);
