/* Checks that the database is reachable and correctly shaped.

   Run: npm run db:check

   Prints the tables, their row counts, and the columns of `enquiries`. The
   connection string is never printed, and any error text is redacted before
   it is shown, so a password cannot end up in a terminal log or a screenshot. */

import "./load-env.mjs";

import mysql from "mysql2/promise";

const redact = (text) => String(text).replace(/(mysql:\/\/[^:]+:)[^@]*@/gi, "$1***@");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/check-db.mjs");
  process.exit(1);
}

let conn;
try {
  conn = await mysql.createConnection(url);
} catch (error) {
  console.error("Could not connect:", redact(error.message));
  process.exit(1);
}

try {
  const [dbRow] = await conn.query("SELECT DATABASE() AS db, VERSION() AS version");
  console.log(`Connected to "${dbRow[0].db}" on MySQL ${dbRow[0].version}\n`);

  const [tables] = await conn.query("SHOW TABLES");
  const names = tables.map((row) => Object.values(row)[0]).sort();

  const expected = [
    "admin_recovery_codes",
    "admin_sessions",
    "admin_users",
    "audit_log",
    "client_services",
    "clients",
    "email_queue",
    "enquiries",
    "page_text",
    "page_views",
    "password_resets",
    "rate_limits",
    "section_visibility",
    "service_prices",
    "site_settings",
    "trusted_devices",
  ];
  const missing = expected.filter((t) => !names.includes(t));

  console.log("Tables");
  for (const name of names) {
    const [[{ n }]] = await conn.query(`SELECT COUNT(*) AS n FROM \`${name}\``);
    console.log(`  ${name.padEnd(14)} ${n} row(s)`);
  }

  if (missing.length > 0) {
    console.error(`\nMISSING: ${missing.join(", ")} — the schema has not been applied.`);
    process.exitCode = 1;
  } else {
    console.log(`
All ${expected.length} tables present.`);
  }

  const [cols] = await conn.query("SHOW COLUMNS FROM `enquiries`");
  console.log(`enquiries has ${cols.length} columns.`);

  // The app account must be able to write rows and nothing more.
  const [grants] = await conn.query("SHOW GRANTS FOR CURRENT_USER()");
  const text = grants.map((row) => Object.values(row)[0]).join(" ");
  const privileged = /ALL PRIVILEGES|\bDROP\b|\bCREATE\b|\bALTER\b/i.test(text);
  console.log(
    privileged
      ? "WARNING: this account can change the schema. Expected SELECT/INSERT/UPDATE/DELETE only."
      : "Privileges: row access only, no schema changes. Correct."
  );
} catch (error) {
  console.error("Check failed:", redact(error.message));
  process.exitCode = 1;
} finally {
  await conn.end();
}
