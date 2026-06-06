export default function CheckoutLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="h-8 bg-neutral-200 rounded w-1/4" />

      {/* Cart items skeleton */}
      <div className="bg-white rounded-lg border divide-y">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-1/3" />
              <div className="h-3 bg-neutral-200 rounded w-1/4" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neutral-200" />
              <div className="w-6 h-4 bg-neutral-200 rounded" />
              <div className="w-8 h-8 rounded-full bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Form skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-neutral-200 rounded w-1/6" />
        <div className="h-10 bg-neutral-200 rounded" />
        <div className="h-4 bg-neutral-200 rounded w-1/6" />
        <div className="h-10 bg-neutral-200 rounded" />
        <div className="h-4 bg-neutral-200 rounded w-1/6" />
        <div className="h-10 bg-neutral-200 rounded" />
        <div className="h-12 bg-neutral-200 rounded" />
      </div>
    </div>
  )
}
