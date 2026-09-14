const STAGES = [
  { label: "Build", caption: "Custom Digital Products" },
  { label: "Automate", caption: "Intelligent Operations" },
  { label: "Grow", caption: "Digital Growth" },
];

// The section's visual conclusion: the three pillars restated as one
// methodology, read left to right at every width — on phones the columns
// simply tighten rather than the rail turning vertical.
//
// Connectors are drawn per segment (node centre to node centre) rather than
// as one container-wide line, so they land exactly on the pillar centres
// above and can draw sequentially left to right. Each connector spans its
// column plus the grid gap, so its width tracks the gap per breakpoint.
export default function JourneyRail() {
  return (
    <div className="journey-rail mt-14 sm:mt-20">
      <ol className="relative grid grid-cols-3 gap-3 sm:gap-6">
        {STAGES.map((stage, i) => (
          <li
            key={stage.label}
            className="relative flex flex-col items-center gap-3 text-center"
          >
            {i < STAGES.length - 1 && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-[5px] h-px w-[calc(100%+0.75rem)] bg-[var(--ap-border)] sm:w-[calc(100%+1.5rem)]"
                />
                <span
                  aria-hidden="true"
                  className="rail-h-blue absolute left-1/2 top-[5px] h-px w-[calc(100%+0.75rem)] origin-left bg-[var(--ap-blue)] sm:w-[calc(100%+1.5rem)]"
                />
              </>
            )}

            <span
              aria-hidden="true"
              className="rail-node relative h-[11px] w-[11px] shrink-0 rounded-full bg-[var(--ap-blue)] shadow-[0_0_0_4px_rgb(0_107_184/0.12)]"
            />

            <div className="rail-text">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ap-blue)] sm:text-[11px] sm:tracking-[0.18em]">
                {stage.label}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--ap-muted)] sm:text-xs">
                {stage.caption}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
