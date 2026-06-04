import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'

type Props = { product: Product }

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)
}

export function ProductCard({ product }: Props) {
  return (
    <Link href={`/menu/${product.slug}`} className="group block">
      <div className="rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">No disponible</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-neutral-900">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.available ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Disponible</span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Agotado</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
