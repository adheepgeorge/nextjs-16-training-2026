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
    <div className="wrap flex gap-8 py-12">
      <aside className="w-44 shrink-0">
        <p className="kicker">Layout demo</p>
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs leading-5 text-ink-3">
          This sidebar lives in{" "}
          <code className="icode">layout-demo/layout.tsx</code> and stays
          mounted when you navigate between child routes.
        </p>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
