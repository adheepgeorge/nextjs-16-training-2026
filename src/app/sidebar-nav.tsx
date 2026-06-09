"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; idx: string };
type NavGroup = { section: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    section: "Session 1 — Routing",
    items: [
      { href: "/about", label: "About (static)", idx: "01" },
      { href: "/blog", label: "Blog (loading.tsx)", idx: "02" },
      {
        href: "/blog/welcome-to-nextjs-16",
        label: "Blog post (dynamic)",
        idx: "03",
      },
      { href: "/layout-demo", label: "Layout demo", idx: "04" },
      { href: "/layout-demo/settings", label: "→ Settings", idx: "05" },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">
        <span className="mark mono">N</span>
        <span className="name">
          next@16
          <span className="tier">Freshers training</span>
        </span>
      </Link>

      {groups.map((group) => (
        <div key={group.section}>
          <p className="nav-section">{group.section}</p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : undefined}
            >
              <span className="idx">{item.idx}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
