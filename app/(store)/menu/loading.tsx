export default function MenuLoading() {
  return (
    <>
      <section className="mb-8">
        <div className="mb-2 h-9 w-48 animate-pulse rounded bg-neutral-200" />
        <div className="h-5 w-96 max-w-full animate-pulse rounded bg-neutral-200" />
      </section>

      <nav className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-neutral-200" />
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-neutral-200 bg-white shadow-sm">
            <div className="aspect-square animate-pulse rounded-t-lg bg-neutral-200" />
            <div className="p-4">
              <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
