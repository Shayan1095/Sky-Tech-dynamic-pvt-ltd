/* Applies any database migrations that have not been applied yet.

   Run: npm run db:migrate

   The application's own account cannot create or alter tables — that is
   deliberate, and it is why this asks for an administrative account instead.
   The password is typed here, used for this one connection, and never stored.

   Which migrations have run is recorded in a schema_migrations table, so this
   is safe to run repeatedly: already-applied files are skipped, and a failure
   stops before anything later is attempted. */

import "./load-env.mjs";

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import mysql from "mysql2/promise";

const ESC = String.fromCharCode(27);
const NEWLINE = String.fromCharCode(10);
const RETURN = String.fromCharCode(13);
const EOT = String.fromCharCode(4);

async function secret(rl, question) {
  let masking = true;
  const onData = (chunk) => {
    if (!masking) return;
    const ch = chunk.toString();
    if (ch === NEWLINE || ch === RETURN || ch === EOT) return;
    try {
      stdout.write(ESC + "[2K" + ESC + "[200D" + question + "*".repeat(rl.line.length));
    } catch {
      masking = false;
    }
  };
  stdin.on("data", onData);
  const answer = await rl.question(question);
  stdin.off("data", onData);
  stdout.write(NEWLINE);
  return answer;
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run this from the sky-tech folder.");
  process.exit(1);
}

// Host, port and database name come from DATABASE_URL; only the credentials
// are asked for, so there is nothing to mistype twice.
const target = new URL(process.env.DATABASE_URL);
const database = decodeURIComponent(target.pathname.replace(/^\//, ""));
const host = target.hostname;
const port = Number(target.port) || 3306;

const DIR = join("drizzle", "apply");
const files = readdirSync(DIR).filter((f) => f.endsWith(".sql")).sort();
if (files.length === 0) {
  console.error("No migrations found in " + DIR);
  process.exit(1);
}

console.log("Database: " + database + " on " + host + ":" + port);
console.log("An account that can create tables is needed (usually root).");
console.log("");

const rl = createInterface({ input: stdin, output: stdout });
const user = (await rl.question("MySQL user [root]: ")).trim() || "root";
const password = await secret(rl, "Password: ");
rl.close();

let conn;
try {
  conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
  });
} catch (error) {
  console.error("Could not connect: " + error.message);
  process.exit(1);
}

try {
  await conn.query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       name VARCHAR(120) NOT NULL,
       applied_at DATETIME NOT NULL,
       PRIMARY KEY (name)
     ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );

  const [applied] = await conn.query("SELECT name FROM schema_migrations");
  const done = new Set(applied.map((row) => row.name));

  /* A database that already has tables but no record of them — the case right
     after this script is introduced — would otherwise try to create them
     again. Anything already present is marked as applied instead. */
  const [tables] = await conn.query("SHOW TABLES");
  const existing = new Set(tables.map((row) => Object.values(row)[0]));

  let ran = 0;
  for (const file of files) {
    if (done.has(file)) continue;

    const sql = readFileSync(join(DIR, file), "utf8");
    const creates = [...sql.matchAll(/CREATE TABLE `([^`]+)`/g)].map((m) => m[1]);
    const alreadyThere = creates.length > 0 && creates.every((t) => existing.has(t));

    if (alreadyThere) {
      await conn.query("INSERT INTO schema_migrations (name, applied_at) VALUES (?, UTC_TIMESTAMP())", [file]);
      console.log("  " + file + " — already present, recorded");
      continue;
    }

    process.stdout.write("  " + file + " — applying… ");
    await conn.query(sql);
    await conn.query("INSERT INTO schema_migrations (name, applied_at) VALUES (?, UTC_TIMESTAMP())", [file]);
    console.log("done");
    ran += 1;
  }

  console.log("");
  console.log(ran === 0 ? "Everything was already up to date." : "Applied " + ran + " migration(s).");
} catch (error) {
  console.error("");
  console.error("Failed: " + error.message);
  console.error("Nothing after this point was applied.");
  process.exitCode = 1;
} finally {
  await conn.end();
}
