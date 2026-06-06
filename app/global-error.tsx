'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h1>
            <p className="text-gray-600 mb-6">
              Ocurrió un error inesperado. Por favor, intentá de nuevo.
            </p>
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
