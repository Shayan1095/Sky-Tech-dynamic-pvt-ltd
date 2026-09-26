/* Makes the maintenance scripts runnable anywhere.

   Locally they are started with `node --env-file=.env.local`, which fills
   process.env before anything runs. On a host there is no .env.local: the
   values are set in the hosting panel, and whether they reach a shell you
   opened yourself is not something to rely on. `--env-file` also needs Node
   20.6 or newer, which a shared host may not have.

   So: anything already in the environment wins, and anything missing is
   looked for in .env.local or .env beside the script. Importing this module
   is enough — it runs on import, before the script's own code.

   Deliberately hand-parsed. A dependency would have to be installed on the
   host to read the file that tells us how to reach the host.
   ------------------------------------------------------------------------ */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/* Beside the script, then one level up — which covers both "tools/" inside a
   deployed app and "scripts/" inside the project. */
const candidates = [
  join(process.cwd(), ".env.local"),
  join(process.cwd(), ".env"),
  join(here, ".env.local"),
  join(here, ".env"),
  join(here, "..", ".env.local"),
  join(here, "..", ".env"),
];

function parse(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip one matching pair of surrounding quotes, and nothing else.
    if (value.length > 1 && ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
}

for (const file of candidates) {
  if (!existsSync(file)) continue;
  let values;
  try {
    values = parse(readFileSync(file, "utf8"));
  } catch {
    continue;
  }
  for (const [key, value] of Object.entries(values)) {
    // Never overwrite what the host already set.
    if (process.env[key] === undefined) process.env[key] = value;
  }
  break;
}

export function requireEnv(name, hint) {
  const value = (process.env[name] ?? "").trim();
  if (!value) {
    console.error("");
    console.error(name + " is not set.");
    if (hint) console.error(hint);
    console.error("");
    console.error("Set it in the hosting panel's environment variables, or run this");
    console.error("command with it in front, for example:");
    console.error("");
    console.error('    ' + name + '="..." node ' + process.argv[1].split(/[\\/]/).pop());
    console.error("");
    process.exit(1);
  }
  return value;
}
