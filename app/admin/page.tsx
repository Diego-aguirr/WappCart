import Link from 'next/link'
import { getAllProducts } from '@/lib/products'
import { requireAuth } from '@/lib/admin-auth'
import DeleteProductButton from './products/delete-button'
import ToggleAvailabilityButton from './products/toggle-availability'
import LogoutButton from './logout-button'

export default async function AdminPage() {
  await requireAuth()

  const products = await getAllProducts()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <LogoutButton />
            <Link
              href="/admin/products/new"
              className="bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
            >
              Add Product
            </Link>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Status: On = visible in menu, Off = hidden from customers
        </p>

        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-[60px_1fr_1fr_80px_100px_140px] md:grid-cols-[60px_1fr_120px_80px_100px_140px] gap-2 p-3 bg-gray-100 text-sm font-medium text-gray-600 border-b">
            <div>Img</div>
            <div>Name</div>
            <div className="hidden md:block">Category</div>
            <div>Price</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[60px_1fr_1fr_80px_100px_140px] md:grid-cols-[60px_1fr_120px_80px_100px_140px] gap-2 p-3 items-center border-b hover:bg-gray-50"
            >
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
              </div>
              <div className="text-sm font-medium truncate">{product.name}</div>
              <div className="hidden md:block text-sm text-gray-600 truncate">
                {product.category}
              </div>
              <div className="text-sm">${Number(product.price).toLocaleString()}</div>
              <div>
                <span
                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    product.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.available ? 'On' : 'Off'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="text-xs bg-neutral-100 text-neutral-700 hover:bg-neutral-200 px-2 py-1 rounded transition-colors"
                  title="Edit"
                >
                  Edit
                </Link>
                <ToggleAvailabilityButton
                  id={product.id}
                  available={product.available}
                />
                <DeleteProductButton id={product.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
