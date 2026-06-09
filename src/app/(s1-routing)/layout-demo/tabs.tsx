"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/layout-demo", label: "Overview" },
  { href: "/layout-demo/settings", label: "Settings" },
];

export function LayoutDemoTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex gap-1 border-b border-rule">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
              active
                ? "border-ink font-medium text-ink"
                : "border-transparent text-ink-3 hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
