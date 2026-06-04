'use client'

import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { submitOrder } from '@/app/actions/order'
import { useState } from 'react'
import Link from 'next/link'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)
}

export default function CheckoutPage() {
  const { items, total, count, updateQty, removeItem, clear } = useCart()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await submitOrder(formData, items)
    
    if (!result.success) {
      setError(result.error || 'Error')
      setLoading(false)
      return
    }

    clear()
    window.open(result.whatsappUrl, '_blank')
  }

  if (count === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 mb-4">Tu carrito está vacío</p>
        <Link href="/menu" className="text-green-600 font-medium hover:underline">
          ← Volver al menú
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl font-bold text-neutral-900 mb-4">Tu Pedido</h1>

      {/* Lista de items */}
      <div className="bg-white rounded-lg border mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-3 p-4 border-b last:border-0">
            {/* Imagen */}
            <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
              <Image
                src={item.product.image || '/Food/logo.png'}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="font-medium block">{item.product.name}</span>
              <span className="text-sm text-neutral-500">
                ${(item.product.price * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => item.quantity === 1 ? removeItem(item.product.id) : updateQty(item.product.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm"
              >
                −
              </button>
              <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.product.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm"
              >
                +
              </button>
            </div>
          </div>
        ))}
        <div className="p-4 bg-neutral-50 flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Formulario */}
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre completo *</label>
          <input
            type="text"
            name="customerName"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono *</label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="1123456789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dirección de entrega *</label>
          <input
            type="text"
            name="address"
            required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            placeholder="Av. Corrientes 1234, CABA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
          <textarea
            name="notes"
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
            placeholder="Sin cebolla, timbre roto..."
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-900 text-white font-bold py-4 rounded-xl hover:bg-black active:scale-[0.98] disabled:opacity-50 transition-all"
        >
          {loading ? 'Enviando...' : 'Confirmar pedido'}
        </button>
      </form>
    </>
  )
}
