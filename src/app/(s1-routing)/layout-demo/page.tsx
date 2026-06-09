import Link from "next/link";

export const metadata = {
  title: "Layout demo",
};

export default function LayoutDemoPage() {
  return (
    <div>
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-4 leading-7 text-ink-2">
        Nested layouts wrap child pages. Navigate to Settings — the sidebar
        persists because the layout does not re-render on client-side
        navigation.
      </p>
    </div>
  );
}
