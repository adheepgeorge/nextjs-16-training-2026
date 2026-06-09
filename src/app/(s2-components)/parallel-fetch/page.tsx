import Link from "next/link";
import type { Metadata } from "next/types";
import { getProducts, getUsers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Parallel fetch",
};

export default async function ParallelFetchPage() {
  const [users, products] = await Promise.all([getUsers(), getProducts()]);

  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Parallel data fetching
      </h1>
      <p className="mt-2 text-ink-2">
        Two independent fetches — <code className="icode">getUsers()</code>{" "}
        (600ms) and <code className="icode">getProducts()</code> (1200ms) —
        kicked off together with <code className="icode">Promise.all</code>.
        Total wait is ~1.2s, not ~1.8s: no request waterfall.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <p className="kicker">Users</p>
          <ul className="mt-3 space-y-1">
            {users.map((user) => (
              <li key={user.id} className="text-ink">
                {user.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <p className="kicker">Products</p>
          <ul className="mt-3 space-y-1">
            {products.map((product) => (
              <li key={product.id} className="flex justify-between text-ink">
                <span>{product.name}</span>
                <span className="text-ink-3">${product.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
