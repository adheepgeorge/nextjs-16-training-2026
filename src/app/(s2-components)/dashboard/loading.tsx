export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-6 py-12">
      <div className="h-4 w-24 rounded bg-zinc-200" />
      <div className="mt-6 h-9 w-56 rounded bg-zinc-200" />
      <div className="mt-3 h-4 w-3/4 rounded bg-zinc-100" />
      <div className="mt-8 space-y-3">
        <div className="h-24 rounded-lg border border-zinc-200 bg-zinc-50" />
        <div className="h-24 rounded-lg border border-zinc-200 bg-zinc-50" />
      </div>
    </div>
  );
}
