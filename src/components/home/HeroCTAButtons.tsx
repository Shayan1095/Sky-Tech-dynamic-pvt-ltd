"use client";

import Link from "next/link";

const ARROW_DELAY_CLASSES = [
  "[animation-delay:0s]",
  "[animation-delay:0.1s]",
  "[animation-delay:0.2s]",
  "[animation-delay:0.3s]",
  "[animation-delay:0.4s]",
];

function ChaseArrow({ delayClass }: { delayClass: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={`shrink-0 text-text opacity-100 group-hover:opacity-15 group-hover:animate-[fadeChase_1.2s_infinite] ${delayClass}`}
      aria-hidden="true"
    >
      <path
        d="M2 6h8M6 2l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroCTAButtons() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <div className="hero-cta">
        <Link
          href="/contact"
          className="group relative flex h-16 w-72 max-w-full items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#2a2a2a] to-text pl-[76px] shadow-[0_3px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-3px_0_rgba(0,0,0,0.4)] transition-shadow duration-500 hover:shadow-[0_6px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-3px_0_rgba(0,0,0,0.4)] sm:w-auto sm:pr-6"
        >
          <span className="absolute top-1/2 left-1.5 flex h-13 w-13 -translate-y-1/2 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-[#33cfff] to-cta px-3 shadow-[inset_0_-2px_0_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] transition-[width] duration-500 ease-in-out group-hover:w-[calc(100%-12px)]">
            {ARROW_DELAY_CLASSES.map((delayClass) => (
              <ChaseArrow key={delayClass} delayClass={delayClass} />
            ))}
          </span>
          <span className="relative z-[2] whitespace-nowrap pr-2 text-sm font-semibold text-bg transition-opacity duration-300 group-hover:opacity-0 sm:pr-0">
            Book a Free Consultation
          </span>
        </Link>
      </div>

      <div className="hero-cta">
        <Link
          href="/services"
          className="flex h-16 items-center rounded-2xl bg-gradient-to-b from-white to-accent/40 px-7 text-sm font-semibold text-text shadow-[0_3px_3px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-4px_0_rgba(0,107,184,0.08)] transition-shadow duration-500 hover:shadow-[0_5px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-4px_0_rgba(0,107,184,0.12)]"
        >
          View Our Work
        </Link>
      </div>
    </div>
  );
}
