"use client";

import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Discover",
    description:
      "We learn your business, audience, competitive landscape, and goals.",
  },
  {
    title: "Strategize",
    description:
      "We recommend the right mix of technology, marketing channels, and timeline.",
  },
  {
    title: "Build & Grow",
    description:
      "We execute, test, launch, and continuously optimize based on real results.",
  },
];

export default function HowWeWork() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section className="bg-accent/30 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-text sm:text-4xl">
          How We Work — A Process Built for Clarity
        </h2>
        <div ref={ref} className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              style={{ transitionDelay: inView ? `${index * 150}ms` : "0ms" }}
              className={cn(
                "text-center transition-all duration-500 ease-out",
                inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              <span className="text-sm font-bold text-primary">
                0{index + 1}
              </span>
              <p className="mt-2 text-xl font-semibold text-text">
                {step.title}
              </p>
              <p className="mt-2 text-sm text-text/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
