export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 animate-pulse">
      <div className="h-4 w-24 rounded bg-zinc-200" />
      <div className="mt-6 h-8 w-48 rounded bg-zinc-200" />
      <ul className="mt-8 space-y-4">
        {[1, 2, 3].map((n) => (
          <li key={n} className="rounded-lg border border-zinc-200 p-4">
            <div className="h-5 w-2/3 rounded bg-zinc-200" />
            <div className="mt-2 h-4 w-full rounded bg-zinc-100" />
          </li>
        ))}
      </ul>
    </div>
  );
}
