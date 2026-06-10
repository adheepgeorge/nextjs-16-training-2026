"use client";

import { useActionState } from "react";
import { type AddTodoState, addTodoAction } from "./actions";

const initialState: AddTodoState = {};

export function AddTodoForm() {
  const [state, formAction, pending] = useActionState(
    addTodoAction,
    initialState,
  );

  return (
    <form action={formAction} className="card mt-8 space-y-3 p-5">
      <div className="flex gap-2">
        <input
          name="text"
          placeholder="Add a todo…"
          className="flex-1 rounded-md border border-rule-2 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-amber"
        />
        <button
          type="submit"
          disabled={pending}
          className="btn disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add"}
        </button>
      </div>
      {state.error ? (
        <p className="text-sm text-rose-ink">{state.error}</p>
      ) : null}
    </form>
  );
}
