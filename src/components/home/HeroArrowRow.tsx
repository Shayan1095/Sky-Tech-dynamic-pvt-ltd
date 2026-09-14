import { cn } from "@/lib/utils";

const ARROW_COUNT = 10;

export default function HeroArrowRow({
  className,
  reverse = false,
}: {
  className?: string;
  reverse?: boolean;
}) {
  const arrows = Array.from({ length: ARROW_COUNT });

  return (
    <div
      className={cn(
        // Tighter spacing below sm so all ten arrows fit a 320px screen.
        "pointer-events-none flex items-center justify-center gap-5 overflow-hidden sm:gap-8",
        className
      )}
    >
      {arrows.map((_, i) => {
        const delay = reverse ? (ARROW_COUNT - 1 - i) * 0.1 : i * 0.1;
        return (
          <svg
            key={i}
            width="13"
            height="13"
            viewBox="0 0 12 12"
            className={cn("shrink-0 text-text", reverse && "rotate-180")}
            style={{
              animation: "fadeChase 1.2s infinite",
              animationDelay: `${delay}s`,
            }}
            aria-hidden="true"
          >
            <path
              d="M3 1l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}
