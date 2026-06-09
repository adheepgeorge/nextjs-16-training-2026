import Link from "next/link";
import { LayoutDemoTabs } from "./tabs";

export default function LayoutDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <p className="kicker mt-4">Layout demo</p>
      <p className="mt-2 max-w-xl text-sm text-ink-3">
        This header and the tabs below live in{" "}
        <code className="icode">layout-demo/layout.tsx</code>. They stay mounted
        when you switch tabs — only the content under them swaps.
      </p>

      <LayoutDemoTabs />

      <div className="mt-6">{children}</div>
    </div>
  );
}
