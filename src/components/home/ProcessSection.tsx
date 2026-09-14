"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, CustomEase } from "@/lib/gsap";

/* Styles and the token map live in globals.css under .sky-process.
   --p-accent resolves to the site's existing --color-primary (#006bb8). */

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const STEPS = [
  { number: "01", title: "Discover", description: "We learn your business, audience, and goals." },
  { number: "02", title: "Strategize", description: "We map the right technology and marketing approach." },
  { number: "03", title: "Design", description: "We create user-focused, on-brand experiences." },
  { number: "04", title: "Build", description: "We develop with clean code and scalable architecture." },
  { number: "05", title: "Launch", description: "We deploy, test, and go live with confidence." },
  { number: "06", title: "Grow", description: "We optimize continuously based on real performance data." },
];

/** Resting tilt, alternating side to side like pinned paper. */
const restTilt = (i: number) => (i % 2 === 0 ? 1.5 : -1.5);

type State = "stack" | "duo" | "lattice";
const stateFor = (w: number): State =>
  w >= 1024 ? "lattice" : w >= 640 ? "duo" : "stack";

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shortLandscape = window.matchMedia(
      "(max-height: 500px) and (orientation: landscape)"
    ).matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    CustomEase.create("procOut", "M0,0 C0.22,1 0.36,1 1,1");

    const track = root.querySelector<HTMLElement>(".proc-track");
    const cells = gsap.utils.toArray<HTMLElement>(".proc-cell", root);
    const nums = cells.map((c) => c.querySelector<HTMLElement>(".proc-num")!);
    if (!track || !cells.length) return;

    /* Derived from the section's own width so JS and the container queries
       can never disagree about which state is live. */
    let state: State = stateFor(root.clientWidth);

    /* ------------------------------------------------- the dashed weave --- */
    let weaveST: ScrollTrigger | null = null;
    let svg: SVGSVGElement | null = null;

    const destroyWeave = () => {
      weaveST?.kill();
      weaveST = null;
      svg?.remove();
      svg = null;
    };

    const buildWeave = () => {
      destroyWeave();
      if (reduced || cells.length < 2) return;

      // Leave from a card's lower edge, arrive at the next card's pin.
      // Layout offsets, not screen rects: they ignore scroll position and the
      // cards' tilt/lift transforms, so the path is the same at any moment.
      const tw = track.offsetWidth;
      const th = track.offsetHeight;
      const a = cells.map((c) => ({
        x: c.offsetLeft + c.offsetWidth / 2,
        top: c.offsetTop,
        bottom: c.offsetTop + c.offsetHeight,
      }));

      let d = "";
      for (let i = 0; i < a.length - 1; i += 1) {
        const s = a[i];
        const e = a[i + 1];
        const k = Math.max(26, (e.top - s.bottom) * 0.62);
        d += `M ${s.x.toFixed(1)} ${s.bottom.toFixed(1)} C ${s.x.toFixed(1)} ${(s.bottom + k).toFixed(1)}, ${e.x.toFixed(1)} ${(e.top - k).toFixed(1)}, ${e.x.toFixed(1)} ${e.top.toFixed(1)} `;
      }
      if (!d) return;

      const NS = "http://www.w3.org/2000/svg";
      svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "proc-weave");
      svg.setAttribute("viewBox", `0 0 ${tw} ${th}`);
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("aria-hidden", "true");

      const accent =
        getComputedStyle(root).getPropertyValue("--p-accent").trim() || "#006bb8";
      const ghost =
        getComputedStyle(root).getPropertyValue("--p-ghost").trim() || "#c8d6e5";

      // the route ahead: dashed, quiet
      const base = document.createElementNS(NS, "path");
      base.setAttribute("d", d);
      base.setAttribute("fill", "none");
      base.setAttribute("stroke", ghost);
      base.setAttribute("stroke-width", "1.5");
      base.setAttribute("stroke-dasharray", "5 7");
      base.setAttribute("stroke-linecap", "round");
      svg.appendChild(base);

      // the route travelled: solid accent, drawn by scroll
      const lit = document.createElementNS(NS, "path");
      lit.setAttribute("d", d);
      lit.setAttribute("fill", "none");
      lit.setAttribute("stroke", accent);
      lit.setAttribute("stroke-opacity", "0.55");
      lit.setAttribute("stroke-width", "1.75");
      lit.setAttribute("stroke-linecap", "round");
      svg.appendChild(lit);

      // Head marker. A soft halo circle rather than a drop-shadow filter:
      // filters re-rasterise every frame the marker moves.
      const head = document.createElementNS(NS, "g");
      head.style.opacity = "0";
      const halo = document.createElementNS(NS, "circle");
      halo.setAttribute("r", "11");
      halo.setAttribute("fill", accent);
      halo.setAttribute("fill-opacity", "0.16");
      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("r", "4.5");
      dot.setAttribute("fill", accent);
      head.appendChild(halo);
      head.appendChild(dot);
      svg.appendChild(head);

      track.appendChild(svg);

      const len = lit.getTotalLength();
      lit.style.strokeDasharray = String(len);
      lit.style.strokeDashoffset = String(len);

      // arc-length at which the head reaches each card
      const marks = a.map((c) => {
        let best = 0;
        let bestD = Infinity;
        for (let l = 0; l <= len; l += 5) {
          const pt = lit.getPointAtLength(l);
          const dd = (pt.x - c.x) ** 2 + (pt.y - c.top) ** 2;
          if (dd < bestD) {
            bestD = dd;
            best = l;
          }
        }
        return best;
      });

      weaveST = ScrollTrigger.create({
        trigger: track,
        start: "top 70%",
        end: "bottom 85%",
        scrub: 1,
        onUpdate: (self) => {
          const at = len * self.progress;
          lit.style.strokeDashoffset = String(len - at);
          const pt = lit.getPointAtLength(at);
          head.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
          head.style.opacity =
            self.progress > 0.002 && self.progress < 0.998 ? "1" : "0";
          nums.forEach((n, i) =>
            n.classList.toggle("is-lit", i === 0 ? at > 0 : at >= marks[i] - 4)
          );
        },
      });
    };

    /* ------------------------------------------------------- active card --- */
    let activeST: ScrollTrigger | null = null;
    const buildActive = () => {
      activeST?.kill();
      activeST = null;
      if (reduced) return;

      // Card positions within the track are cached; only the track's own
      // screen position is read per update — one layout read, not six. Resting
      // layout is used, so a card's own lift never changes which is active.
      const layout = cells.map((c) => ({ top: c.offsetTop, h: c.offsetHeight }));

      const update = () => {
        const vh = window.innerHeight;
        const mid = vh / 2;
        const trackTop = track.getBoundingClientRect().top;
        let best = -1;
        let bestD = Infinity;
        layout.forEach((l, i) => {
          const top = trackTop + l.top;
          if (top + l.h < 0 || top > vh) return;
          const dd = Math.abs(top + l.h / 2 - mid);
          if (dd < bestD) {
            bestD = dd;
            best = i;
          }
        });
        cells.forEach((c, i) => {
          const on = i === best;
          if (c.classList.contains("is-active") === on) return;
          c.classList.toggle("is-active", on);
          // the card straightens and lifts as it comes under inspection
          gsap.to(c, {
            rotation: on ? 0 : restTilt(i),
            y: on ? -6 : 0,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };

      activeST = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: update,
      });
      update();
    };

    /* ------------------------------------------------------------ reveal --- */
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.fromTo(
          ".proc-cell",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.2,
            scrollTrigger: { trigger: track, start: "top 88%", once: true },
          }
        );
        return;
      }

      gsap.set(".proc-line", { scaleX: 0, transformOrigin: "left center" });

      const head = gsap.timeline({ paused: true });
      ScrollTrigger.create({
        trigger: root,
        start: "top 80%",
        once: true,
        onEnter: () => head.play(),
      });
      head
        .to(".proc-line", { scaleX: 1, duration: 0.5, ease: "none" }, 0)
        .fromTo(".proc-eyebrow", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, 0.05)
        .fromTo(
          ".proc-h2-line",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "procOut" },
          0.1
        );

      /* Each card owns its trigger: the zigzag spreads them far apart, so a
         shared stagger would strand the later ones. The pin lands first and
         the card swings down onto it. */
      cells.forEach((cell, i) => {
        const pin = cell.querySelector<HTMLElement>(".proc-pin");
        const fromX = state === "stack" ? 0 : i % 2 === 0 ? 56 : -56;
        const tl = gsap.timeline({ paused: true });

        ScrollTrigger.create({
          trigger: cell,
          start: "top 88%",
          once: true,
          onEnter: () => tl.play(),
        });

        if (pin) {
          tl.fromTo(
            pin,
            { opacity: 0, y: -14, scale: 0.6 },
            { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2)" },
            0
          );
        }

        tl.fromTo(
          cell,
          { opacity: 0, x: fromX, y: 34, rotation: restTilt(i) * 3.2 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: restTilt(i),
            duration: shortLandscape ? 0.5 : 0.8,
            ease: "procOut",
          },
          0.12
        );

        if (!shortLandscape) {
          const counter = { v: 0 };
          const target = Number(STEPS[i].number);
          tl.to(
            counter,
            {
              v: target,
              duration: 0.5,
              ease: "none",
              onUpdate: () => {
                nums[i].textContent = String(Math.round(counter.v)).padStart(2, "0");
              },
            },
            0.2
          );
        }
      });
    }, root);

    /* ------------------------------------------- pointer-only enhancement --- */
    const pointerCleanups: Array<() => void> = [];

    const bindPointer = () => {
      pointerCleanups.splice(0).forEach((fn) => fn());
      if (!finePointer || state !== "lattice" || reduced) return;

      cells.forEach((cell, i) => {
        const spot = cell.querySelector<HTMLElement>(".proc-spot");
        let rect = cell.getBoundingClientRect();
        let raf = 0;
        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;

        const loop = () => {
          cx += (tx - cx) * 0.12;
          cy += (ty - cy) * 0.12;
          gsap.set(cell, { rotationY: cx, rotationX: cy, transformPerspective: 900 });
          if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) {
            raf = requestAnimationFrame(loop);
          } else {
            raf = 0;
          }
        };
        const kick = () => {
          if (!raf) raf = requestAnimationFrame(loop);
        };

        const onEnter = () => {
          rect = cell.getBoundingClientRect();
          cell.style.willChange = "transform";
        };
        const onMove = (e: PointerEvent) => {
          tx = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
          ty = (0.5 - (e.clientY - rect.top) / rect.height) * 8;
          if (spot) {
            spot.style.setProperty("--mx", `${(e.clientX - rect.left).toFixed(0)}px`);
            spot.style.setProperty("--my", `${(e.clientY - rect.top).toFixed(0)}px`);
          }
          kick();
        };
        const onLeave = () => {
          tx = 0;
          ty = 0;
          kick();
          cell.style.willChange = "";
        };

        cell.addEventListener("pointerenter", onEnter);
        cell.addEventListener("pointermove", onMove);
        cell.addEventListener("pointerleave", onLeave);
        pointerCleanups.push(() => {
          cell.removeEventListener("pointerenter", onEnter);
          cell.removeEventListener("pointermove", onMove);
          cell.removeEventListener("pointerleave", onLeave);
          if (raf) cancelAnimationFrame(raf);
          gsap.set(cell, { rotationY: 0, rotationX: 0 });
          void i;
        });
      });
    };

    /* ---------------------------------------------------- build + observe ---
       Rebuilding appends the SVG and calls ScrollTrigger.refresh(), both of
       which make the ResizeObserver fire again. Without a guard that turns
       into a chain of debounced rebuilds and the weave stays a step behind
       the layout for a second or so after every resize. A geometry signature
       makes a self-triggered pass a no-op, and measuring inside rAF means the
       cards have finished re-wrapping before the path is generated. */
    let signature = "";

    // Layout offsets only. Screen rects change on every scroll and with every
    // tilt/lift transform, which made scrolling look like a resize and caused
    // a full rebuild plus a page-wide ScrollTrigger.refresh() twice a second.
    const geometrySignature = () =>
      `${track.offsetWidth}x${track.offsetHeight}|` +
      cells
        .map((c) => `${c.offsetLeft},${c.offsetTop},${c.offsetWidth},${c.offsetHeight}`)
        .join(";");

    const buildAll = (force = false) => {
      const next = geometrySignature();
      // A rebuild appends the SVG and refreshes ScrollTrigger, both of which
      // make the observer fire again. The signature makes that second pass a
      // no-op, so the chain terminates without a flag that could swallow a
      // genuine resize (an observer delivers one batch per frame — drop it
      // and the resize is lost for good).
      if (!force && next === signature) return;
      signature = next;
      buildWeave();
      buildActive();
      bindPointer();
      ScrollTrigger.refresh();
    };

    buildAll(true);

    let debounce = 0;
    const schedule = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        // measure inside rAF so the cards have finished re-wrapping
        requestAnimationFrame(() => {
          state = stateFor(root.clientWidth);
          buildAll();
        });
      }, 120);
    };

    /* Two sources, deliberately. ResizeObserver catches container-driven
       changes the viewport never sees (a sidebar opening, the component
       dropped into a narrower column); the resize listener catches viewport
       changes and covers environments where RO fails to deliver. Both funnel
       through the same debounce, and the geometry signature makes a duplicate
       pass free. */
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    ro.observe(track);
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule);

    /* Safety net. The weave is generated from measured geometry, so if it ever
       goes stale the section is visibly wrong. Events are not guaranteed —
       some embedders resize the viewport without dispatching `resize` or
       delivering ResizeObserver records at all — so the geometry signature is
       also polled. It only reads rects when the section is near the viewport,
       and a matching signature costs nothing. */
    const poll = window.setInterval(() => {
      const b = root.getBoundingClientRect();
      if (b.bottom < -window.innerHeight || b.top > window.innerHeight * 2) return;
      if (geometrySignature() !== signature) buildAll();
    }, 500);

    document.fonts?.ready.then(() => buildAll(true));

    return () => {
      window.clearTimeout(debounce);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      window.clearInterval(poll);
      ro.disconnect();
      pointerCleanups.splice(0).forEach((fn) => fn());
      destroyWeave();
      activeST?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="process-heading" className="sky-process">
      <div className="proc-inner">
        <p className="proc-eyebrow inline-flex items-center gap-3 rounded-full border border-[var(--p-hairline)] bg-white/70 px-4 py-2">
          <span aria-hidden="true" className="proc-line block h-px w-6 bg-[var(--p-accent)]" />
          <span className="proc-eyebrow-text font-mono uppercase tracking-[0.22em] text-[var(--p-accent)]">
            Our Process
          </span>
        </p>

        <h2
          id="process-heading"
          className="proc-h2 mt-7 max-w-3xl font-display font-medium tracking-tight text-[var(--p-ink)]"
        >
          <span className="proc-h2-line block">From Idea to Impact</span>
          <span className="proc-h2-line block text-[var(--p-accent)]">
            — A Clearer Way to Build
          </span>
        </h2>

        <ol className="proc-track mt-16 sm:mt-20">
          {STEPS.map((step) => (
            <li key={step.number} className="proc-cell">
              <span aria-hidden="true" className="proc-pin" />
              <span
                aria-hidden="true"
                className="proc-spot pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgb(0 107 184 / 0.07), transparent 70%)",
                }}
              />

              <p aria-hidden="true" className="proc-num font-mono tracking-[0.16em]">
                {step.number}
              </p>

              <h3 className="proc-title mt-3 font-display font-semibold leading-snug tracking-tight">
                <span className="sr-only">{`Step ${step.number} — `}</span>
                {step.title}
              </h3>

              <p className="proc-body mt-3 max-w-sm leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
