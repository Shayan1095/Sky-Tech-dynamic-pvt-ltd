import "server-only";

import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { databaseUrl, hasDatabase } from "./env";
import * as schema from "./schema";

/* ---------------------------------------------------------------------------
   Database connection.

   The pool is created on first use, not at import time, so that a build or a
   deploy without DATABASE_URL still succeeds. It is cached on globalThis
   because dev-server hot reloads re-evaluate modules, and a fresh pool per
   reload would exhaust the connection allowance within minutes.

   How large the pool should be depends entirely on how many copies of this
   process exist, and that differs by host:

   One long-running server (Hostinger's Node.js hosting, a VPS, `next start`
   on any machine) means one pool for the whole site. Six is right there: the
   dashboard issues six independent queries together, and a smaller pool turns
   that single wait into several.

   Serverless (Vercel) means the opposite. The platform starts a fresh copy of
   the app per concurrent request and discards it afterwards, and each copy
   builds its own pool. Six there is not six connections, it is six times
   however many copies happen to be running — so a modest traffic spike walks
   straight into the host's connection cap and MySQL starts refusing everyone,
   visitors and administrators alike, exactly when the site is busiest.

   A serverless copy serves roughly one request at a time, so two is enough to
   let a page's queries overlap without any one copy hoarding connections.
   DB_POOL_SIZE overrides both, for a host that turns out to allow more or
   less than expected.
   ------------------------------------------------------------------------ */

/* Vercel sets VERCEL; other platforms that run this way set the Lambda
   variable. Either means "many short-lived copies", which is what matters. */
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

function poolSize(): number {
  const override = Number(process.env.DB_POOL_SIZE);
  if (Number.isInteger(override) && override > 0 && override <= 50) return override;
  return isServerless ? 2 : 6;
}

type Handle = { pool: mysql.Pool; db: MySql2Database<typeof schema> };

const cache = globalThis as unknown as { __skyDb?: Handle };

export function db(): MySql2Database<typeof schema> | null {
  if (!hasDatabase()) return null;
  if (!cache.__skyDb) {
    const limit = poolSize();
    const pool = mysql.createPool({
      uri: databaseUrl(),
      connectionLimit: limit,

      /* Queue rather than throw when every connection is busy. A request that
         waits a moment is a slow page; a request that throws is a broken one. */
      waitForConnections: true,
      queueLimit: 0,

      /* Hand idle connections back instead of holding them open. On a shared
         database the cap counts connections, not queries, so one idle copy of
         the app holding connections it is not using is taking them from a copy
         that is. It also matters against a remote database, where a link left
         open across a freeze is usually dead by the time it is reused. */
      idleTimeout: 30_000,
      maxIdle: limit,

      /* Fail fast rather than leaving a visitor watching a spinner: the form
         reports "unavailable" and they still have everything they typed. A
         database across the internet needs longer to answer than one on the
         same machine, so this is not as tight as it looks. */
      connectTimeout: 10_000,

      /* Keeps the TCP link alive through the idle gaps that a managed or
         remote database would otherwise reap without telling us. */
      enableKeepAlive: true,
      keepAliveInitialDelay: 10_000,

      /* Everything is stored and compared in UTC. */
      timezone: "Z",
    });
    cache.__skyDb = { pool, db: drizzle(pool, { schema, mode: "default" }) };
  }
  return cache.__skyDb.db;
}

/** What the pool was actually sized to — used by scripts/check-db.mjs. */
export const poolInfo = () => ({ size: poolSize(), serverless: isServerless });

export { schema };
