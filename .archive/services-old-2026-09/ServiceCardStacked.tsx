"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const ROTATIONS = [-2, -1, 1, -1.5, 0.5, -0.5];

export interface ServiceCardData {
  title: string;
  description: string;
  href: string;
}

export default function ServiceCardStacked({
  title,
  description,
  href,
  index,
}: ServiceCardData & { index: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rotation = ROTATIONS[index % ROTATIONS.length];

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 640px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.set(el, { rotate: rotation, scale: 0.94, opacity: 0, y: 24 });

        const tween = gsap.to(el, {
          rotate: 0,
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: (index % 6) * 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      }
    );

    return () => mm.revert();
  }, [index, rotation]);

  return (
    <div ref={wrapperRef} className="h-full">
      <Link
        href={href}
        className="group relative block h-full rounded-2xl border border-accent bg-bg p-6 shadow-sm transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:scale-[1.05] hover:bg-accent/40 hover:shadow-xl active:scale-[1.02]"
      >
        <p className="text-lg font-semibold text-text group-hover:text-primary">
          {title}
        </p>
        <p className="mt-2 text-sm text-text/70">{description}</p>
        <span className="mt-4 inline-block text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Explore →
        </span>
      </Link>
    </div>
  );
}
