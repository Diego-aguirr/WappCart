import Link from 'next/link'

export default function MenuNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">
        Menú no encontrado
      </h1>
      <p className="text-lg text-neutral-600 mb-8">
        No se pudo cargar el menú. Probablemente no hay productos disponibles.
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
