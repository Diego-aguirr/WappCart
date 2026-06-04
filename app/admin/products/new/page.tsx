import { requireAdmin } from '@/lib/admin-auth'
import ProductForm from '../product-form'
import Link from 'next/link'

export default async function NewProductPage() {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Product</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
        <ProductForm />
      </div>
    </div>
  )
}
