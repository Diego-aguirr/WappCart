import { getProducts, getCategories } from '@/features/products/services/product-service'
import { ProductGrid } from '@/features/products/components/ProductGrid'

export const metadata = {
  title: 'Menú | WappCart',
  description: 'Explorá nuestro menú de comida casera.',
}

export const revalidate = 300

export default async function MenuPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Nuestro Menú</h1>
        <p className="mt-2 text-neutral-600">Descubrí nuestros platos caseros.</p>
      </section>

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Categorías">
        {categories.map(cat => (
          <span key={cat.id} className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
            {cat.name}
          </span>
        ))}
      </nav>

      <ProductGrid products={products} />
    </>
  )
}
