import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
      <p className="text-xl text-neutral-600 mb-8">
        La página que buscás no existe
      </p>
      <Link
        href="/"
        className="bg-neutral-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
