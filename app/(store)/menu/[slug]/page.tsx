import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/features/products/services/product-service'
import { ProductDetail } from '@/features/products/components/ProductDetail'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Producto no encontrado | WappCart' }
  }

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
