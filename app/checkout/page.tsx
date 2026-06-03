'use client'

import { useCart } from '@/app/cart-context'
import { submitOrder } from '@/app/actions/order'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const total = getTotal()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const customerName = formData.get('customerName') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
    const notes = formData.get('notes') as string

    const result = await submitOrder(customerName, phone, address, items, notes)

    if (!result.success) {
      setError(Object.values(result.error || {}).flat().join(', '))
      setLoading(false)
      return
    }

    // Limpiar carrito y redirigir a WhatsApp
    clearCart()
    window.open(result.whatsappUrl, '_blank')
    router.push('/menu')
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-neutral-600 mb-6">Agregá productos del menú para hacer tu pedido.</p>
        <a
          href="/menu"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
        >
          Ver Menú
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Resumen del pedido */}
      <div className="bg-neutral-50 rounded-lg p-6 mb-8">
        <h2 className="font-semibold mb-4">Tu pedido</h2>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.product.id} className="flex justify-between">
              <span>{item.quantity}x {item.product.name}</span>
              <span>${(item.product.price * item.quantity).toLocaleString('es-AR')}</span>
            </li>
          ))}
        </ul>
        <div className="border-t mt-4 pt-4 font-bold text-lg flex justify-between">
          <span>Total</span>
          <span>${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      {/* Formulario */}
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="1123456789"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-2">
            Dirección de entrega *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Av. Corrientes 1234, CABA"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Sin cebolla, timbre roto, etc."
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Enviar pedido por WhatsApp'}
        </button>
      </form>
    </div>
  )
}
