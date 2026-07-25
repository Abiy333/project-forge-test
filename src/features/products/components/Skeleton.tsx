export function CatalogSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 space-y-4">
          {/* Animated Image Placeholder */}
          <div className="h-48 w-full bg-zinc-200 animate-pulse rounded-lg" />
          {/* Animated Title Line */}
          <div className="h-4 w-2/3 bg-zinc-200 animate-pulse rounded" />
          {/* Animated Price Line */}
          <div className="h-4 w-1/3 bg-zinc-200 animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}