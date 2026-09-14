"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { submitContact } from "@/app/contact/actions";
import ServiceSelect from "@/components/contact/ServiceSelect";
import {
  CUSTOM_BUDGET,
  FIELD_LIMITS,
  isService,
  packagesFor,
  STEP_ONE,
  STEP_TWO,
  readValues,
  validate,
  type ContactErrors,
  type ContactField,
  type ContactResult,
} from "@/lib/contact";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";
const ERROR = "text-[#b42318]";

const PHONE = { label: "+92 333 567 3810", href: "tel:+923335673810" };
const EMAIL = { label: "info@skytech.com.pk", href: "mailto:info@skytech.com.pk" };

const initialState: ContactResult = { status: "idle" };

/* Underlined field with a floating label: the label rests inside the field
   until it's focused or filled, then lifts; a blue rule draws across on
   focus. Errors are announced and tied to the field for screen readers. */
function Field({
  name,
  label,
  required = false,
  type = "text",
  autoComplete,
  inputMode,
  error,
  multiline = false,
  className = "",
}: {
  name: ContactField;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  error?: string;
  multiline?: boolean;
  className?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const base =
    "peer block w-full border-0 border-b bg-transparent pb-3 pt-7 text-base text-text outline-none transition-colors duration-300 placeholder:text-transparent " +
    (error ? "border-[#b42318]" : "border-text/15 hover:border-text/30");
  const shared = {
    id,
    name,
    placeholder: " ",
    maxLength: FIELD_LIMITS[name],
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    "aria-required": required || undefined,
  };

  return (
    <div className={className}>
      <div className="relative">
        {multiline ? (
          <textarea {...shared} rows={4} className={`${base} min-h-[132px] resize-y`} />
        ) : (
          <input {...shared} type={type} autoComplete={autoComplete} inputMode={inputMode} className={base} />
        )}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-0 top-1.5 origin-left text-[0.78rem] font-medium tracking-[0.01em] transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] peer-placeholder-shown:top-7 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-[0.78rem] ${
            error ? ERROR : "text-text/55 peer-focus:text-primary"
          }`}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="text-primary">
              {" "}*
            </span>
          )}
        </label>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100"
        />
      </div>
      {error && (
        <p id={errorId} className={`mt-2 text-[0.8rem] ${ERROR}`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statusRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<ContactErrors>({});
  // Service drives which budget packages are offered.
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const packages = packagesFor(service);

  const [state, formAction, pending] = useActionState(submitContact, initialState);

  /* Section entrance, once. */
  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(".cf-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.6, ease: "power3.out" }, 0)
        .fromTo(".cf-eyebrow", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.06)
        .fromTo(".cf-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" }, 0.12)
        .fromTo(".cf-panel, .cf-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.14, ease: "power3.out" }, 0.3);
      ScrollTrigger.create({ trigger: root, start: "top 75%", once: true, onEnter: () => tl.play() });
    }, root);

    return () => ctx.revert();
  }, []);

  /* The step that just became active slides in. */
  const firstStepRender = useRef(true);
  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false;
      return;
    }
    const el = stepRefs.current[step - 1];
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
  }, [step]);

  const focusField = (name: ContactField) => {
    // Custom controls (the service picker) mark their focusable element.
    const el =
      formRef.current?.querySelector<HTMLElement>(`[data-field="${name}"]`) ??
      formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`);
    el?.focus();
  };

  /* Server responses: show field errors on the right step, or move focus to
     the status message so it's announced. */
  // State follows each new response during render (React's recommended
  // pattern); the effect below only moves focus once it has painted.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "invalid") {
      setErrors(state.errors);
      const first = [...STEP_ONE, ...STEP_TWO].find((f) => state.errors[f]);
      if (first) setStep(STEP_ONE.includes(first) ? 1 : 2);
    }
  }

  useEffect(() => {
    if (state.status === "invalid") {
      const first = [...STEP_ONE, ...STEP_TWO].find((f) => state.errors[f]);
      if (first) requestAnimationFrame(() => focusField(first));
    } else if (state.status === "unavailable" || state.status === "success") {
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }, [state]);

  const currentValues = () => readValues(new FormData(formRef.current ?? undefined));

  const goNext = () => {
    const found = validate(currentValues(), STEP_ONE);
    setErrors(found);
    const first = STEP_ONE.find((f) => found[f]);
    if (first) {
      focusField(first);
      return;
    }
    /* A link such as /contact?service=Google%20Ads preselects the service, so
       service pages can send visitors straight to a pre-filled form. Read
       here, as step 2 opens, so the server and first client render match. */
    if (!service) {
      const requested = new URLSearchParams(window.location.search).get("service");
      if (requested && isService(requested)) setService(requested);
    }
    setStep(2);
    requestAnimationFrame(() => stepRefs.current[1]?.querySelector<HTMLElement>("h4")?.focus());
  };

  const goBack = () => {
    setStep(1);
    requestAnimationFrame(() => stepRefs.current[0]?.querySelector<HTMLElement>("h4")?.focus());
  };

  /* Client check first; the server checks again. The action is dispatched
     manually (not via the form's action prop) so React doesn't reset the
     fields after the round trip — if delivery fails or the server rejects a
     field, the visitor keeps everything they typed. */
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const found = validate(readValues(new FormData(form)), [...STEP_ONE, ...STEP_TWO]);
    setErrors(found);
    const first = [...STEP_ONE, ...STEP_TWO].find((f) => found[f]);
    if (first) {
      setStep(STEP_ONE.includes(first) ? 1 : 2);
      requestAnimationFrame(() => focusField(first));
      return;
    }
    const data = new FormData(form);
    startTransition(() => formAction(data));
  };

  // A render helper rather than a nested component, so the heading isn't
  // remounted (and focus lost) every time the form re-renders.
  const stepHeader = (n: 1 | 2, title: string) => (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[12px] tracking-[0.14em] text-primary">0{n}</span>
      <h4 tabIndex={-1} className="font-display text-[1.35rem] font-semibold tracking-[-0.015em] text-text outline-none sm:text-[1.5rem]">
        {title}
      </h4>
      <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-text/45">
        Step {n} of 2
      </span>
    </div>
  );

  const submitted = state.status === "success";

  return (
    <section
      ref={sectionRef}
      id="contact-form"
      aria-labelledby="contact-form-heading"
      className="relative scroll-mt-24 bg-bg"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <p className="cf-eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="cf-line block h-px w-8 bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">01</span>
          </p>
          <h2
            id="contact-form-heading"
            className="cf-heading mt-5 text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-text sm:text-[3rem] lg:text-[3.6rem]"
          >
            Contact Form
          </h2>

          <div className="mt-12 grid items-start gap-6 lg:mt-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.4fr)] lg:gap-10">
            {/* --------------------------------------------- Trust line */}
            {/* Contact details live in the hero card, so this panel carries
                only the trust line — one statement per line. */}
            <aside className="cf-panel relative isolate overflow-hidden rounded-[24px] bg-navy p-7 text-white sm:p-9 lg:sticky lg:top-28">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(120%_80%_at_100%_0%,#000_0%,transparent_70%)]"
              />
              <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-cta">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>

              <p className="mt-8 font-display text-[1.5rem] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[1.75rem]">
                <span className="block">No obligation.</span>
                <span className="block">No hard sell.</span>
                <span className="mt-3 block text-white/65">Just a conversation about your goals.</span>
              </p>
            </aside>

            {/* --------------------------------------------------- Form */}
            <div className="cf-card relative rounded-[28px] border border-text/[0.08] bg-white p-6 shadow-[0_1px_2px_rgb(18_18_18/0.04),0_30px_60px_-36px_rgb(18_18_18/0.25)] sm:p-10">
              {/* Progress */}
              <div aria-hidden="true" className="grid grid-cols-2 gap-2">
                {[1, 2].map((n) => (
                  <span key={n} className="relative block h-[3px] overflow-hidden rounded-full bg-text/[0.08]">
                    <span
                      className={`absolute inset-0 origin-left rounded-full bg-primary transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
                        submitted || step >= n ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                ))}
              </div>

              {submitted ? (
                <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col items-start py-12 outline-none">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="mt-6 font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text">
                    Thank you — your message has been sent.
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8">
                  {/* Honeypot — hidden from people and assistive tech */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label>
                      Leave this field empty
                      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  {/* Step 1 */}
                  <div ref={(el) => { stepRefs.current[0] = el; }} hidden={step !== 1}>
                    {stepHeader(1, "Your Details")}
                    <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                      <Field name="name" label="Name" required autoComplete="name" error={errors.name} />
                      <Field name="company" label="Company" required autoComplete="organization" error={errors.company} />
                      <Field name="email" label="Work Email" required type="email" inputMode="email" autoComplete="email" error={errors.email} />
                      <Field name="phone" label="Phone" required type="tel" inputMode="tel" autoComplete="tel" error={errors.phone} />
                      <Field name="country" label="Country" required autoComplete="country-name" error={errors.country} className="sm:col-span-2" />
                    </div>

                    <div className="mt-10 flex justify-end">
                      <button
                        type="button"
                        onClick={goNext}
                        className="group inline-flex min-h-[52px] items-center gap-4 rounded-full bg-primary py-2 pl-7 pr-2 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        Next
                        <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0.5">
                          <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" fill="none"><path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div ref={(el) => { stepRefs.current[1] = el; }} hidden={step !== 2}>
                    {stepHeader(2, "Project Details")}

                    {/* Service — branded picker grouped by category */}
                    <ServiceSelect
                      name="need"
                      label="What do you need?"
                      placeholder="Select a service"
                      value={service}
                      onChange={(next) => {
                        if (next !== service) setBudget("");
                        setService(next);
                      }}
                      error={errors.need}
                      className="mt-7"
                    />

                    {/* Budget — the chosen service's packages, plus a custom amount */}
                    <fieldset className="mt-8">
                      <legend className={`text-[0.78rem] font-medium tracking-[0.01em] ${errors.budget ? ERROR : "text-text/55"}`}>
                        Estimated Budget
                      </legend>
                      {!service && (
                        <p className="mt-2 text-[0.85rem] text-text/55">
                          Select a service to see its packages, or enter a custom budget.
                        </p>
                      )}

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {packages.map((p) => (
                          <label key={p.name} className="relative block cursor-pointer">
                            <input
                              type="radio"
                              name="budget"
                              value={p.name}
                              checked={budget === p.name}
                              onChange={() => setBudget(p.name)}
                              className="peer sr-only"
                            />
                            <span className="flex h-full min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-text/15 px-4 py-3 transition-[border-color,background-color,box-shadow] duration-300 hover:border-primary/60 peer-checked:border-primary peer-checked:bg-primary/[0.04] peer-checked:shadow-[inset_0_0_0_1px_var(--color-primary)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                              <span className="text-[0.92rem] leading-snug text-text">{p.name}</span>
                              <span className="whitespace-nowrap font-mono text-[0.78rem] tracking-[0.02em] text-primary">{p.price}</span>
                            </span>
                          </label>
                        ))}

                        <label className="relative block cursor-pointer">
                          <input
                            type="radio"
                            name="budget"
                            value={CUSTOM_BUDGET}
                            checked={budget === CUSTOM_BUDGET}
                            onChange={() => setBudget(CUSTOM_BUDGET)}
                            className="peer sr-only"
                          />
                          <span className="flex h-full min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-dashed border-text/25 px-4 py-3 transition-[border-color,background-color,box-shadow] duration-300 hover:border-primary/60 peer-checked:border-solid peer-checked:border-primary peer-checked:bg-primary/[0.04] peer-checked:shadow-[inset_0_0_0_1px_var(--color-primary)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                            <span className="text-[0.92rem] leading-snug text-text">Custom Budget</span>
                            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 text-primary" fill="none">
                              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          </span>
                        </label>
                      </div>
                      {errors.budget && <p className={`mt-2 text-[0.8rem] ${ERROR}`}>{errors.budget}</p>}

                      {budget === CUSTOM_BUDGET && (
                        <Field name="budgetCustom" label="Your budget" required error={errors.budgetCustom} className="mt-3" />
                      )}
                    </fieldset>

                    <div className="mt-6 grid gap-x-8 gap-y-5">
                      <Field name="details" label="Project Details" multiline error={errors.details} />
                      <Field name="timeline" label="Timeline" error={errors.timeline} />
                    </div>

                    {state.status === "unavailable" && (
                      <div
                        ref={statusRef}
                        tabIndex={-1}
                        role="alert"
                        className="mt-8 rounded-2xl border border-[#b42318]/25 bg-[#b42318]/[0.04] p-5 text-[0.92rem] leading-relaxed text-text outline-none"
                      >
                        We couldn&apos;t send your message just now. Please email{" "}
                        <a href={EMAIL.href} className="font-medium text-primary underline underline-offset-4">{EMAIL.label}</a>{" "}
                        or call{" "}
                        <a href={PHONE.href} className="font-medium text-primary underline underline-offset-4">{PHONE.label}</a>.
                      </div>
                    )}

                    <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text/65 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        <svg viewBox="0 0 16 16" className="h-[12px] w-[12px]" fill="none" aria-hidden="true"><path d="M13 8H3.5M7.5 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={pending}
                        aria-busy={pending}
                        className="group relative isolate inline-flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-primary py-2 pl-7 pr-2 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-80"
                      >
                        <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                        {pending ? "Sending…" : "Book My Free Consultation"}
                        <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                          {pending ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : (
                            <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] transition-transform duration-500 group-hover:translate-x-0.5" fill="none"><path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
