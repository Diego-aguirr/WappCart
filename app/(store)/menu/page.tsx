import { getProducts, getCategories } from '@/features/products/services/product-service'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { Badge } from '@/components/ui/Badge'

export const metadata = {
  title: 'Menú | WappCart',
  description: 'Explorá nuestro menú de comida casera. Empanadas, milanesas, pizzas y más.',
}

export default async function MenuPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  return (
    <>
      <section className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">Nuestro Menú</h1>
        <p className="text-neutral-600">
          Descubrí nuestros platos caseros preparados con ingredientes frescos.
        </p>
      </section>

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Categorías">
        {categories.map((category) => (
          <Badge key={category.id} variant="neutral">
            {category.name}
          </Badge>
        ))}
      </nav>

      <ProductGrid products={products} />
    </>
  )
}
