import Link from "next/link";
import { getTodos } from "@/lib/data";
import { toggleTodoAction } from "./actions";
import { AddTodoForm } from "./add-todo-form";

export const metadata = {
  title: "Todos",
};

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Todos</h1>
      <p className="mt-2 text-ink-2">
        Same Server Action pattern as the guestbook, with one upgrade: the add
        form is a small <code className="icode">'use client'</code> component
        using <code className="icode">useActionState</code>. That hook gives us
        a <code className="icode">pending</code> flag (the button shows
        “Adding…”) and a returned <code className="icode">state</code> for
        server-side validation errors. Each toggle is its own
        progressive-enhancement form.
      </p>

      <AddTodoForm />

      <ul className="mt-8 space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="card flex items-center gap-3 px-4 py-3">
            <form action={toggleTodoAction}>
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                aria-label={todo.done ? "Mark not done" : "Mark done"}
                className={`flex h-6 w-6 items-center justify-center rounded-md border text-sm transition-colors ${
                  todo.done
                    ? "border-green bg-[var(--green-100)] text-green-ink"
                    : "border-rule-2 text-transparent hover:border-ink-3"
                }`}
              >
                ✓
              </button>
            </form>
            <span
              className={todo.done ? "text-ink-3 line-through" : "text-ink"}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>

      <div className="note tip mt-10">
        <span className="ico">★</span>
        <p>
          <strong>You can now build a real app.</strong> Route (S1) → render
          &amp; fetch data (S2) → mutate &amp; refresh (S3). That loop —{" "}
          <code className="icode">async</code> Server Components to read,{" "}
          <code className="icode">'use server'</code> actions +{" "}
          <code className="icode">revalidatePath</code> to write — is a
          complete, working CRUD feature.
        </p>
      </div>
    </div>
  );
}
