export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded w-1/6" />
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-[60px_1fr_1fr_80px_100px_140px] gap-2 p-3 bg-gray-100">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>

          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-[60px_1fr_1fr_80px_100px_140px] gap-2 p-3 border-b">
              <div className="w-10 h-10 rounded bg-gray-200" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-12" />
              <div className="flex gap-1">
                <div className="h-6 bg-gray-200 rounded w-12" />
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
