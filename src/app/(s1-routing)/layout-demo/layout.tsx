import Link from "next/link";

const navItems = [
  { href: "/layout-demo", label: "Overview" },
  { href: "/layout-demo/settings", label: "Settings" },
];

export default function LayoutDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-3xl gap-8 px-6 py-12">
      <aside className="w-44 shrink-0">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Layout demo
        </p>
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs text-zinc-500 leading-5">
          This sidebar lives in{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5">
            layout-demo/layout.tsx
          </code>{" "}
          and stays mounted when you navigate between child routes.
        </p>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
