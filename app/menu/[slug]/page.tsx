import { getProductBySlug, getProducts } from '@/features/products/services/product-service'
import { notFound } from 'next/navigation'
import { ProductDetail } from '@/features/products/components/ProductDetail'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: `${product.name} | WappCart`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
