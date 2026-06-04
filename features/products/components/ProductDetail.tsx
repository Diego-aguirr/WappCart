import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'

type Props = { product: Product }

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)
}

export function ProductDetail({ product }: Props) {
  return (
    <article>
      <nav className="mb-6">
        <Link href="/menu" className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
          ← Volver al menú
        </Link>
      </nav>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6 flex flex-col justify-center gap-4">
            <div>
              <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full capitalize">
                {product.category}
              </span>
              <h1 className="mt-2 text-3xl font-bold text-neutral-900">{product.name}</h1>
            </div>

            <p className="text-neutral-600">{product.description}</p>

            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.available ? (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Disponible
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  No disponible
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
