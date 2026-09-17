/* Each pillar's visual identity, shared by the What We Do tiles and the
   pillar sections themselves — so a visitor who saw "Digital Marketing &
   Growth" as a cyan tile with a rising trajectory meets the same cyan and
   the same trajectory when they arrive at the section.

   Every colour is one of the site's own — #006BB8, #00C2FF, #0B1F35 —
   recombined. Nothing new enters the brand.

   `label` is the accent used for small text on a navy ground, chosen to
   clear 4.5:1 there; `spark` is decorative only, which is why pillar 03 can
   use navy as its spark and still have a legible label. */

export type MotifKind = "grid" | "growth" | "frames";

export type Identity = {
  spark: string;
  spark2?: string;
  label: string;
  motif: MotifKind;
  /* How the accent meets the dark ground. "corner" lights one corner;
     "dual" lights both lower corners for a symmetric wash. Pillars 02 and
     03 both sit in the cyan family — there are only so many accents that
     stay legible on navy — so geometry, not hue, is what separates them. */
  bleed: "corner" | "dual";
};

export const IDENTITY: Record<string, Identity> = {
  "01": { spark: "#006bb8", label: "#4aa3e0", motif: "grid", bleed: "corner" },
  "02": { spark: "#00c2ff", spark2: "#006bb8", label: "#00c2ff", motif: "growth", bleed: "corner" },
  "03": { spark: "#00c2ff", spark2: "#006bb8", label: "#7fd8ff", motif: "frames", bleed: "dual" },
};

export const identityFor = (index: string): Identity =>
  IDENTITY[index] ?? IDENTITY["01"];

/* Which accent leads the gradient bleed, and which supports it. Pillar 03's
   own spark is navy, which is invisible against a navy panel — so where the
   ground is dark it leads with its second accent instead. Anywhere the two
   are the same colour this is a no-op. */
export const bleedFor = (identity: Identity) =>
  identity.spark === "#0b1f35"
    ? { lead: identity.spark2 ?? identity.label, support: identity.spark }
    : { lead: identity.spark, support: identity.spark2 ?? identity.spark };

/* Drawn rather than illustrated: the same hairline vocabulary as the rest of
   the page, at whatever scale the caller positions it. */
export function Motif({
  kind,
  className,
}: {
  kind: MotifKind;
  className: string;
}) {
  if (kind === "grid") {
    // Structure: a wireframe being assembled.
    return (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
        <rect x="14" y="14" width="92" height="92" rx="6" />
        <path d="M14 42h92M14 74h92M46 14v92M78 14v92" strokeWidth="1" />
        <rect x="14" y="14" width="32" height="28" rx="6" fill="currentColor" stroke="none" opacity="0.5" />
      </svg>
    );
  }

  if (kind === "growth") {
    // Growth: a rising trajectory over its own columns.
    return (
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
        <path d="M14 104h92" strokeWidth="1" />
        <rect x="22" y="72" width="16" height="32" rx="3" opacity="0.55" />
        <rect x="46" y="56" width="16" height="48" rx="3" opacity="0.75" />
        <rect x="70" y="34" width="16" height="70" rx="3" fill="currentColor" stroke="none" opacity="0.5" />
        <path d="M18 66l22-16 20 12 28-34" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M74 28h16v16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Composition: overlapping frames with a play mark.
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
      <rect x="10" y="26" width="64" height="64" rx="8" opacity="0.5" />
      <rect x="34" y="14" width="72" height="72" rx="8" />
      <circle cx="70" cy="50" r="18" strokeWidth="1" />
      <path d="M65 42l14 8-14 8z" fill="currentColor" stroke="none" opacity="0.7" />
    </svg>
  );
}
