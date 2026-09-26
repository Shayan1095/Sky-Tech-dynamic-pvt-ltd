import type { Config } from "drizzle-kit";

/* Generates the SQL for src/lib/server/schema.ts into drizzle/.

   The generated file is applied by hand through phpMyAdmin: shared hosting has
   no shell to run a migration command from, so the SQL is a reviewable
   artefact that gets pasted in, rather than something a deploy runs blind.

   `npx drizzle-kit generate` — no database connection required. */
export default {
  schema: "./src/lib/server/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
} satisfies Config;
