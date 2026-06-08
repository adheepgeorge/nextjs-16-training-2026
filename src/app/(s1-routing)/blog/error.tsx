"use client";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-red-700">Blog error</h1>
      <p className="mt-3 text-zinc-600">
        This UI comes from{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          blog/error.tsx
        </code>
        . Visit{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
          /blog/trigger-error
        </code>{" "}
        to see it in action.
      </p>
      <p className="mt-2 font-mono text-sm text-zinc-500">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700"
      >
        Try again
      </button>
    </div>
  );
}
