"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, controlClassName } from "@/components/forms/field";
import { ErrorState } from "@/components/feedback/states";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={controlClassName}
        />
      </Field>
      <Field label="Kata sandi" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className={controlClassName}
        />
      </Field>
      {state.error ? <ErrorState message={state.error} /> : null}
      <Button type="submit" disabled={pending} className="h-12 w-full rounded-xl text-base">
        {pending ? "Masuk..." : "Masuk"}
      </Button>
    </form>
  );
}

