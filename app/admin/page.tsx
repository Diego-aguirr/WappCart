import Link from 'next/link'
import { getAllProducts } from '@/lib/products'
import { requireAdmin } from '@/lib/admin-auth'
import DeleteProductButton from './products/delete-button'
import ToggleAvailabilityButton from './products/toggle-availability'

export default async function AdminPage() {
  await requireAdmin()

  const products = await getAllProducts()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">Image</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Category</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Price</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-left whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    ${Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm whitespace-nowrap ${
                        product.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:underline whitespace-nowrap"
                      >
                        Edit
                      </Link>
                      <ToggleAvailabilityButton
                        id={product.id}
                        available={product.available}
                      />
                      <DeleteProductButton id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
