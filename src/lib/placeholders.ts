/* Unfilled template placeholders.

   The compose templates leave square brackets wherever only a person can
   write the words — "[what you understood]", "by [day]". The comment above
   those templates used to claim a message "cannot be sent without being
   read", but nothing enforced it, and a customer received one beginning
   "Hi [Name]". This is the enforcement.

   It lives outside the server folder so the form and the action can share one
   definition. A warning that disagreed with the rule doing the blocking would
   be worse than no warning at all.

   Brackets are refused, not forbidden: real messages occasionally contain
   them, so sending is allowed once it has been confirmed deliberately. The
   default is the safe one, which is the part that was missing.
   ------------------------------------------------------------------------ */

/* Deliberately narrow. A placeholder is short, sits on one line, and is not
   empty — so "[Name]" and the longest prompt in the templates, "[What you
   need from them to start, and roughly how long it takes.]", both match,
   while a stray bracket or a long quoted passage does not.

   It does match things that are not placeholders: "a[0]" in a code snippet,
   a "[sic]". That is the reason this refuses rather than forbids — those are
   rare, and a second press sends them. Erring towards catching too much is
   the right way round when the cost of missing one is a customer receiving
   "Hi [Name]". */
const PLACEHOLDER = /\[[^\][\n]{1,100}\]/g;

/** Every unfilled placeholder across the given parts, without duplicates. */
export function findPlaceholders(...parts: string[]): string[] {
  const found = parts.flatMap((part) => part.match(PLACEHOLDER) ?? []);
  return [...new Set(found)];
}

/** A short, readable list for a warning: at most four, then "and N more". */
export function describePlaceholders(found: string[]): string {
  if (found.length === 0) return "";
  const shown = found.slice(0, 4).join(", ");
  const rest = found.length - 4;
  return rest > 0 ? `${shown} and ${rest} more` : shown;
}
