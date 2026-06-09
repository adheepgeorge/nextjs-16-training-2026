"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="card flex items-center gap-4 p-4">
      <button
        type="button"
        onClick={() => setCount((c) => c - 1)}
        className="h-9 w-9 rounded-md border border-rule-2 text-lg text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
      >
        −
      </button>
      <span className="mono min-w-12 text-center text-2xl tabular-nums text-ink">
        {count}
      </span>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="h-9 w-9 rounded-md border border-rule-2 text-lg text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
      >
        +
      </button>
    </div>
  );
}
