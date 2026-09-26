/* Prints the most recent enquiry and the queue counts — the quickest way to
   confirm a submission really landed. Nothing here writes.

   Run: npm run db:latest */

import "./load-env.mjs";

import mysql from "mysql2/promise";

const redact = (t) => String(t).replace(/(mysql:\/\/[^:]+:)[^@]*@/gi, "$1***@");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

let conn;
try {
  conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await conn.query("SELECT * FROM enquiries ORDER BY id DESC LIMIT 1");
  if (rows.length === 0) {
    console.log("No enquiries stored yet.");
  } else {
    console.log("Most recent enquiry\n");
    for (const [key, value] of Object.entries(rows[0])) {
      const text = value instanceof Date ? value.toISOString() : String(value ?? "");
      console.log(`  ${key.padEnd(14)} ${text.length > 70 ? `${text.slice(0, 70)}…` : text}`);
    }
  }
  const [[queue]] = await conn.query(
    "SELECT COUNT(*) AS n FROM email_queue WHERE status = 'pending'"
  );
  const [[total]] = await conn.query("SELECT COUNT(*) AS n FROM enquiries");
  console.log(`\n${total.n} enquiry row(s), ${queue.n} email(s) waiting to send.`);
} catch (error) {
  console.error("Failed:", redact(error.message));
  process.exitCode = 1;
} finally {
  if (conn) await conn.end();
}
