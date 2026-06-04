import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import ProductForm from '../product-form'
import Link from 'next/link'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
        <ProductForm
          id={id}
          defaultValues={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: Number(product.price),
            image: product.image,
            category: product.category,
            available: product.available,
          }}
        />
      </div>
    </div>
  )
}
