"use client";

import { useTransition, type ReactNode } from "react";

import { useToast } from "@/components/admin/Toaster";

/* A form whose server action reports back.

   The status buttons and the notes boxes used to submit and say nothing: the
   page re-rendered with the new value and you were left guessing whether the
   click had registered. This runs the same action and raises a toast when it
   returns, without changing how the action itself works.

   `pending` disables the button rather than hiding it, so the layout does not
   move underneath a cursor mid-click.
   ------------------------------------------------------------------------ */

export function ActionForm({
  action,
  message,
  className,
  children,
}: {
  /* An action may answer with a problem instead of nothing. Returning void
     still works, so the actions that cannot fail are left alone. */
  action: (formData: FormData) => Promise<void | { error: string }>;
  /** What the toast says once it has gone through. */
  message: string;
  className?: string;
  children: ReactNode;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={className}
      action={(formData) => {
        startTransition(async () => {
          /* The success toast used to fire whatever came back, so an action
             that refused its input still said it had worked. */
          const result = await action(formData);
          if (result && "error" in result) toast(result.error, "bad");
          else toast(message);
        });
      }}
    >
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
