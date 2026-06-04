import type { Product } from '@/lib/types'
import { MenuItem } from './MenuItem'
import { groupByCategory } from '@/lib/sheets'

export function MenuList({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p className="text-center text-neutral-500 py-12">No hay productos disponibles</p>
  }

  const groups = groupByCategory(products)

  return (
    <div className="space-y-8">
      {Array.from(groups.entries()).map(([category, items]) => (
        <section key={category}>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">
            {category}
          </h2>
          <div className="space-y-0">
            {items.map(product => (
              <MenuItem key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
