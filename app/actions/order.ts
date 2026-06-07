'use server'

import { z } from 'zod'
import type { CartItem } from '@/lib/types'
import { checkRateLimit, sanitizeString } from '@/lib/security'

const OrderSchema = z.object({
  customerName: z.string()
    .min(2, 'Nombre requerido')
    .max(100, 'Nombre demasiado largo')
    .trim()
    .refine(val => !/[<>]/.test(val), 'El nombre contiene caracteres no permitidos'),
  
  phone: z.string()
    .regex(/^\+?[\d\s\-()]{8,15}$/, 'Teléfono inválido'),
  
  address: z.string()
    .min(5, 'Dirección requerida')
    .max(200, 'Dirección demasiado larga')
    .trim()
    .refine(val => !/[<>]/.test(val), 'La dirección contiene caracteres no permitidos'),
  
  paymentMethod: z.enum(['efectivo', 'transferencia']),
  
  notes: z.string()
    .max(500)
    .trim()
    .optional()
    .default(''),
})

function generateMessage(
  name: string,
  phone: string,
  address: string,
  items: CartItem[],
  total: number,
  paymentMethod: string,
  notes?: string
): string {
  const paymentLabel = paymentMethod === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia'
  
  const lines = [
    '🛒 *Nuevo Pedido - WappCart*',
    '',
    `👤 *Nombre:* ${name}`,
    `📱 *Teléfono:* ${phone}`,
    `📍 *Dirección:* ${address}`,
    `💳 *Pago:* ${paymentLabel}`,
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

  // Sanitize inputs
  const sanitizedData = {
    customerName: sanitizeString(result.data.customerName),
    phone: sanitizeString(result.data.phone),
    address: sanitizeString(result.data.address),
    paymentMethod: result.data.paymentMethod,
    notes: result.data.notes ? sanitizeString(result.data.notes) : undefined,
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const phone = process.env.WHATSAPP_NUMBER || '5491123456789'
  
  const message = generateMessage(
    sanitizedData.customerName,
    sanitizedData.phone,
    sanitizedData.address,
    items,
    total,
    sanitizedData.paymentMethod,
    sanitizedData.notes
  )

  return {
    success: true,
    whatsappUrl: `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
  }
}
