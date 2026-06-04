import { getProductBySlug } from '@/lib/sheets'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'No encontrado' }
  return { title: `${product.name} | WappCart` }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h1 className="text-2xl font-bold text-neutral-900">{product.name}</h1>
      <p className="text-neutral-600 mt-2">{product.description}</p>
      <p className="text-xl font-bold text-neutral-900 mt-4">
        ${product.price.toLocaleString('es-AR')}
      </p>
      <div className="mt-4 flex gap-2">
        <span className="text-sm bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full capitalize">
          {product.category}
        </span>
        {product.available ? (
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">Disponible</span>
        ) : (
          <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">Sin stock</span>
        )}
      </div>
    </div>
  )
}
