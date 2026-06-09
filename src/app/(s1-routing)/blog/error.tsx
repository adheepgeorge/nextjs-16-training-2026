"use client";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="wrap py-12">
      <h1 className="text-2xl font-semibold text-rose-ink">Blog error</h1>
      <p className="mt-3 text-ink-2">
        This UI comes from <code className="icode">blog/error.tsx</code>. Visit{" "}
        <code className="icode">/blog/trigger-error</code> to see it in action.
      </p>
      <p className="mono mt-2 text-sm text-ink-3">{error.message}</p>
      <button type="button" onClick={reset} className="btn mt-6">
        Try again
      </button>
    </div>
  );
}
