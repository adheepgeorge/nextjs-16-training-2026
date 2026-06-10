import Link from "next/link";
import { getGuestbookEntries } from "@/lib/data";
import { signGuestbook } from "./actions";

export const metadata = {
  title: "Guestbook",
};

export default async function GuestbookPage() {
  const entries = await getGuestbookEntries();

  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Guestbook</h1>
      <p className="mt-2 text-ink-2">
        The simplest write: a plain <code className="icode">&lt;form&gt;</code>{" "}
        whose <code className="icode">action</code> is a{" "}
        <code className="icode">'use server'</code> function. On submit the
        action runs <strong>on the server</strong>, appends the entry, then
        calls <code className="icode">revalidatePath('/guestbook')</code> so
        this server-rendered list re-renders with the new row. No{" "}
        <code className="icode">useState</code>, no{" "}
        <code className="icode">fetch</code> — and it works even before JS
        loads.
      </p>

      <form action={signGuestbook} className="card mt-8 space-y-4 p-5">
        <div>
          <label htmlFor="name" className="kicker mb-1.5 block">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="Grace Hopper"
            className="w-full rounded-md border border-rule-2 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <div>
          <label htmlFor="message" className="kicker mb-1.5 block">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={2}
            placeholder="Say hello…"
            className="w-full resize-none rounded-md border border-rule-2 bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-amber"
          />
        </div>
        <button type="submit" className="btn">
          Sign guestbook
        </button>
      </form>

      <ul className="mt-8 space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="card px-5 py-4">
            <p className="text-ink">{entry.message}</p>
            <p className="mt-1.5 text-sm text-ink-3">— {entry.name}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-ink-3">
        Next,{" "}
        <Link href="/todos" className="link font-medium">
          /todos
        </Link>{" "}
        adds <code className="icode">useActionState</code> for pending + error
        UI.
      </p>
    </div>
  );
}
