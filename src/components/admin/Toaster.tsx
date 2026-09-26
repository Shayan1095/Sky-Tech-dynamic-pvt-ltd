"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* Confirmations that do not move the page.

   An inline "Saved" banner pushes everything below it down at the exact
   moment someone is reading it. A toast says the same thing without touching
   the layout, and takes itself away.

   Successes only. An error belongs next to the field that caused it, where it
   can still be read after the four seconds are up — a mistake someone has to
   act on should not disappear on a timer.
   ------------------------------------------------------------------------ */

export type ToastTone = "ok" | "bad";

type Toast = { id: number; message: string; tone: ToastTone };

const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});

export const useToast = () => useContext(ToastContext);

const LIFETIME = 4000;

export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (message: string, tone: ToastTone = "ok") => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      /* Only confirmations expire. Something that went wrong stays until it
         is dismissed, because it is the one the reader has to act on — which
         is what this file said it did long before it did it. */
      if (tone === "ok") {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), LIFETIME)
        );
      }
    },
    [dismiss]
  );

  // Nothing should be left running when the panel is navigated away from.
  // The map is read inside the effect: a ref is not render data.
  useEffect(() => {
    const store = timers.current;
    return () => {
      store.forEach(clearTimeout);
      store.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="toast pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-navy px-4 py-3 text-[0.875rem] text-white shadow-[0_8px_30px_rgba(11,31,53,0.22)]"
          >
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                toast.tone === "bad" ? "bg-[#ff6b6b]/20" : "bg-cta/20"
              }`}
            >
              {/* A tick on a failure is the worst thing this could say. */}
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
                <path
                  d={toast.tone === "bad" ? "M8 4v5M8 11.5v.5" : "M3.5 8.5l3 3 6-7"}
                  stroke={toast.tone === "bad" ? "#ff6b6b" : "#00c2ff"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="min-w-0">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="ml-auto shrink-0 rounded px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35 transition-colors duration-150 hover:text-white"
            >
              Close
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
