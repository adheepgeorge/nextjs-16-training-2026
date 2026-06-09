"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4 rounded-lg border border-zinc-200 p-4">
      <button
        type="button"
        onClick={() => setCount((c) => c - 1)}
        className="h-9 w-9 rounded-md border border-zinc-300 text-lg text-zinc-700 hover:bg-zinc-100"
      >
        −
      </button>
      <span className="min-w-12 text-center font-mono text-2xl tabular-nums">
        {count}
      </span>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="h-9 w-9 rounded-md border border-zinc-300 text-lg text-zinc-700 hover:bg-zinc-100"
      >
        +
      </button>
    </div>
  );
}
