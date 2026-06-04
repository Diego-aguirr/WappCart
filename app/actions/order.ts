'use server'

import { z } from 'zod'
import type { CartItem } from '@/lib/types'

const OrderSchema = z.object({
  customerName: z.string().min(2, 'Nombre requerido'),
  phone: z.string().regex(/^\d{10,15}$/, 'Teléfono inválido'),
  address: z.string().min(5, 'Dirección requerida'),
  notes: z.string().max(500).optional(),
})

function generateMessage(
  name: string,
  phone: string,
  address: string,
  items: CartItem[],
  total: number,
  notes?: string
): string {
  const lines = [
    '🛒 *Nuevo Pedido - WappCart*',
    '',
    `👤 *Nombre:* ${name}`,
    `📱 *Teléfono:* ${phone}`,
    `📍 *Dirección:* ${address}`,
    '',
    '📋 *Productos:*',
    ...items.map(i => `  • ${i.quantity}x ${i.product.name} — $${(i.product.price * i.quantity).toLocaleString('es-AR')}`),
    '',
    `💰 *Total: $${total.toLocaleString('es-AR')}*`,
  ]
  if (notes) lines.push('', `📝 *Notas:* ${notes}`)
  return lines.join('\n')
}

export async function submitOrder(
  formData: FormData,
  items: CartItem[]
): Promise<{ success: boolean; whatsappUrl?: string; error?: string }> {
  const data = Object.fromEntries(formData)
  const result = OrderSchema.safeParse(data)
  
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  if (!items.length) {
    return { success: false, error: 'El carrito está vacío' }
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const phone = process.env.WHATSAPP_NUMBER || '5491123456789'
  
  const message = generateMessage(
    result.data.customerName,
    result.data.phone,
    result.data.address,
    items,
    total,
    result.data.notes
  )

  return {
    success: true,
    whatsappUrl: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
  }
}
