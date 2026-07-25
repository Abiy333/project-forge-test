export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="h-8 w-48 rounded-md bg-zinc-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-28 rounded-lg border border-zinc-200 bg-zinc-100" />
        <div className="h-28 rounded-lg border border-zinc-200 bg-zinc-100" />
        <div className="h-28 rounded-lg border border-zinc-200 bg-zinc-100" />
      </div>
      <div className="h-64 rounded-lg border border-zinc-200 bg-zinc-100" />
    </div>
  );
}