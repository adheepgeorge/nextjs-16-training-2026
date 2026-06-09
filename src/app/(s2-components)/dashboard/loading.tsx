export default function DashboardLoading() {
  return (
    <div className="wrap animate-pulse py-12">
      <div className="h-4 w-24 rounded bg-rule-2" />
      <div className="mt-6 h-9 w-56 rounded bg-rule-2" />
      <div className="mt-3 h-4 w-3/4 rounded bg-rule" />
      <div className="mt-8 space-y-3">
        <div className="card h-24 bg-surface-3" />
        <div className="card h-24 bg-surface-3" />
      </div>
    </div>
  );
}
