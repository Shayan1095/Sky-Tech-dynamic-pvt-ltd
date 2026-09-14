/* Shared by the root layout (a server component) and the Preloader (a client
   component), so it lives in a plain module rather than the "use client"
   file — a server component can't import plain values from a client file. */

export const SEEN_KEY = "sky:seen";

/* Runs from the root layout before hydration: a visitor who has already seen
   the intro this session gets a flag on <html> that hides the preloader via
   CSS, so it never flashes on reloads or later visits in the same session. */
export const SEEN_SCRIPT = `try{if(sessionStorage.getItem("${SEEN_KEY}"))document.documentElement.setAttribute("data-sky-seen","")}catch(e){}`;
