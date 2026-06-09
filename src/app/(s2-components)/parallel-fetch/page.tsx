import Link from "next/link";
import { getProducts, getUsers } from "@/lib/data";

export const metadata = {
  title: "Parallel fetch",
};

export default async function ParallelFetchPage() {
  const [users, products] = await Promise.all([getUsers(), getProducts()]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Parallel data fetching</h1>
      <p className="mt-2 text-zinc-600">
        Two independent fetches —{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          getUsers()
        </code>{" "}
        (600ms) and{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          getProducts()
        </code>{" "}
        (1200ms) — kicked off together with{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          Promise.all
        </code>
        . Total wait is ~1.2s, not ~1.8s: no request waterfall.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Users
          </p>
          <ul className="mt-3 space-y-1">
            {users.map((user) => (
              <li key={user.id} className="text-zinc-800">
                {user.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-zinc-200 p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Products
          </p>
          <ul className="mt-3 space-y-1">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex justify-between text-zinc-800"
              >
                <span>{product.name}</span>
                <span className="text-zinc-500">${product.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
