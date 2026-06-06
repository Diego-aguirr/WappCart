export default function MenuLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden bg-neutral-200" />

      {/* Products skeleton */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-4 flex gap-4">
            <div className="w-20 h-20 rounded-lg bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
              <div className="h-3 bg-neutral-200 rounded w-1/4" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>
            <div className="w-16 h-8 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
