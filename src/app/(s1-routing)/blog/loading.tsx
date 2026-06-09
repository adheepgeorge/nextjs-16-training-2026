export default function BlogLoading() {
  return (
    <div className="wrap animate-pulse py-12">
      <div className="h-4 w-24 rounded bg-rule-2" />
      <div className="mt-6 h-8 w-48 rounded bg-rule-2" />
      <ul className="mt-8 space-y-3">
        {[1, 2, 3].map((n) => (
          <li key={n} className="card px-5 py-4">
            <div className="h-5 w-2/3 rounded bg-rule-2" />
            <div className="mt-2 h-4 w-full rounded bg-rule" />
          </li>
        ))}
      </ul>
    </div>
  );
}
