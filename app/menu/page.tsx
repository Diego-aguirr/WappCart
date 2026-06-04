import { getProducts } from '@/lib/sheets'
import { MenuList } from '@/components/MenuList'

export const metadata = {
  title: 'Menú | WappCart',
  description: 'Nuestro menú de comidas',
}

export const revalidate = 300

export default async function MenuPage() {
  const products = await getProducts()

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Nuestro Menú</h1>
        <p className="text-sm text-neutral-500 mt-1">Agregá lo que quieras y te lo llevamos</p>
      </div>

      <MenuList products={products} />
    </>
  )
}
