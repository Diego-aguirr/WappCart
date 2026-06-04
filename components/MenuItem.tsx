'use client'

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
    <div className="flex items-start justify-between gap-4 py-3 border-b border-neutral-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-neutral-900">{product.name}</h3>
          {!product.available && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Sin stock</span>
          )}
        </div>
        {product.description && (
          <p className="text-sm text-neutral-500 mt-0.5 truncate">{product.description}</p>
        )}
        <span className="text-sm font-medium text-neutral-900 mt-1 block">
          {formatPrice(product.price)}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {quantity === 0 ? (
          <button
            onClick={() => product.available && addItem(product)}
            disabled={!product.available}
            className="bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-green-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
          >
            Agregar
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-neutral-100 rounded-full px-1 py-1">
            <button
              onClick={() => quantity === 1 ? removeItem(product.id) : updateQty(product.id, quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-neutral-700 hover:bg-neutral-200 text-sm font-bold"
            >
              −
            </button>
            <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
            <button
              onClick={() => updateQty(product.id, quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-neutral-700 hover:bg-neutral-200 text-sm font-bold"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
