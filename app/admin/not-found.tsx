import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">
        Página no encontrada
      </h1>
      <p className="text-lg text-neutral-600 mb-8">
        La página que buscás no existe en el panel de administración.
      </p>
      <Link
        href="/admin"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Volver al admin
      </Link>
    </div>
  )
}
