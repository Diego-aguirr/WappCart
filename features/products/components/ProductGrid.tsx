import type { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

type Props = { products: Product[] }

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-neutral-500">No hay productos disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
