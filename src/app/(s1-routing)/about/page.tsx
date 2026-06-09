import Link from "next/link";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="wrap py-12">
      <Link href="/" className="backlink">
        ← Back to demos
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        About this repo
      </h1>
      <p className="mt-4 leading-7 text-ink-2">
        This file is{" "}
        <code className="icode">src/app/(s1-routing)/about/page.tsx</code>. The{" "}
        <code className="icode">(s1-routing)</code> folder is a route group — it
        organizes Session 1 demos without adding a URL segment. The route is
        simply <code className="icode">/about</code>.
      </p>
      <p className="mt-4 leading-7 text-ink-2">
        No data fetching here — just a server component that renders HTML on
        each request.
      </p>
    </div>
  );
}
