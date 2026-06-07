'use client'

import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/format'

export function MenuItem({ product }: { product: Product }) {
  const { items, addItem, updateQty, removeItem } = useCart()
  const item = items.find(i => i.product.id === product.id)
  const quantity = item?.quantity || 0

  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0">
      {/* Imagen */}
      <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
        <img
          src={product.image || '/Food/logo.png'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-neutral-900 text-base">{product.name}</h3>
          {!product.available && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-200 text-neutral-500 px-2 py-0.5 rounded-full">
              Agotado
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-sm text-neutral-400 mt-0.5 line-clamp-1">{product.description}</p>
        )}
        <span className="text-sm font-semibold text-neutral-900 mt-1.5 block">
          {formatPrice(product.price)}
        </span>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-1 shrink-0">
        {quantity === 0 ? (
          <button
            onClick={() => product.available && addItem(product)}
            disabled={!product.available}
            aria-label={`Agregar ${product.name} al carrito`}
            className="bg-neutral-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-black active:scale-95 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-all"
          >
            Agregar
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-neutral-100 rounded-xl px-1.5 py-1.5" role="group" aria-label={`Cantidad de ${product.name}`}>
            <button
              onClick={() => quantity === 1 ? removeItem(product.id) : updateQty(product.id, quantity - 1)}
              aria-label={`Reducir cantidad de ${product.name}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-neutral-700 hover:bg-neutral-50 text-sm font-bold shadow-sm"
            >
              −
            </button>
            <span className="text-sm font-bold w-5 text-center" aria-live="polite" aria-atomic="true">{quantity}</span>
            <button
              onClick={() => updateQty(product.id, quantity + 1)}
              aria-label={`Aumentar cantidad de ${product.name}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-neutral-700 hover:bg-neutral-50 text-sm font-bold shadow-sm"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
