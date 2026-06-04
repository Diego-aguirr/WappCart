export default function ProductDetailLoading() {
  return (
    <article>
      <nav className="mb-6">
        <div className="h-5 w-24 animate-pulse rounded bg-neutral-200" />
      </nav>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-t-lg bg-neutral-200 md:rounded-l-lg md:rounded-tr-none" />

          <div className="flex flex-col justify-center gap-4 px-4 py-6">
            <div>
              <div className="mb-2 h-5 w-20 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-9 w-3/4 animate-pulse rounded bg-neutral-200" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-neutral-200" />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-8 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
