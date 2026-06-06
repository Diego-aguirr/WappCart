'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Menu error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">
        No pudimos cargar el menú
      </h1>
      <p className="text-lg text-neutral-600 mb-8">
        Ocurrió un error al cargar los productos. Por favor, intentá de nuevo.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="border border-neutral-300 text-neutral-900 px-6 py-3 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
