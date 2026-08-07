import Image from 'next/image'
import { getProducts } from '@/lib/products'
import { MenuList } from '@/components/MenuList'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Menú | WappCart',
  description: 'Nuestro menú de comidas',
}

export default async function MenuPage() {
  const products = await getProducts()

  return (
    <>
      {/* Hero */}
      <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden">
        <Image
          src="/Food/Hero.png"
          alt="WappCart - Comida casera"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-2xl font-bold">Nuestro Menú</h1>
            <p className="text-sm text-white/80 mt-1">Agregá lo que quieras y te lo llevamos</p>
          </div>
        </div>
      </div>

      <MenuList products={products} />
    </>
  )
}
