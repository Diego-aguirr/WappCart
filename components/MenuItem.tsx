import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)
}

export function MenuItem({ product }: { product: Product }) {
  const { items, addItem, updateQty, removeItem } = useCart()
  const item = items.find(i => i.product.id === product.id)
  const quantity = item?.quantity || 0

  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0">
      {/* Imagen */}
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
        <Image
          src={product.image || '/Food/logo.png'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-neutral-900">{product.name}</h3>
          {!product.available && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Sin stock</span>
          )}
        </div>
        {product.description && (
          <p className="text-sm text-neutral-500 mt-0.5 line-clamp-1">{product.description}</p>
        )}
        <span className="text-sm font-medium text-neutral-900 mt-1 block">
          {formatPrice(product.price)}
        </span>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-1 shrink-0">
        {quantity === 0 ? (
          <button
            onClick={() => product.available && addItem(product)}
            disabled={!product.available}
            className="bg-neutral-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-black active:scale-95 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all"
          >
            Agregar
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-neutral-100 rounded-full px-1 py-1">
            <button
              onClick={() => quantity === 1 ? removeItem(product.id) : updateQty(product.id, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-neutral-700 hover:bg-neutral-200 text-sm font-bold"
            >
              −
            </button>
            <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
            <button
              onClick={() => updateQty(product.id, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-neutral-700 hover:bg-neutral-200 text-sm font-bold"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
