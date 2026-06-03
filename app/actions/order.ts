'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { generateWhatsAppMessage, getWhatsAppUrl } from '@/lib/whatsapp'
import type { CartItem } from '@/lib/types'

const OrderSchema = z.object({
  customerName: z.string().min(2, 'El nombre es requerido').max(100),
  phone: z.string().regex(/^\d{10,15}$/, 'Teléfono inválido (10-15 dígitos)'),
  address: z.string().min(5, 'La dirección es requerida').max(200),
  notes: z.string().max(500).optional(),
})

type ActionResult = {
  success: boolean
  whatsappUrl?: string
  error?: Record<string, string[]>
}

export async function submitOrder(
  customerName: string,
  phone: string,
  address: string,
  items: CartItem[],
  notes?: string
): Promise<ActionResult> {
  // 1. Validar datos del formulario
  const result = OrderSchema.safeParse({ customerName, phone, address, notes })
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors }
  }

  // 2. Validar que hay items
  if (!items || items.length === 0) {
    return { success: false, error: { items: ['El carrito está vacío'] } }
  }

  // 3. Calcular total
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  // 4. Generar mensaje de WhatsApp
  const message = generateWhatsAppMessage(
    result.data.customerName,
    result.data.phone,
    result.data.address,
    items,
    total,
    result.data.notes
  )

  // 5. Generar URL de WhatsApp
  const whatsappUrl = getWhatsAppUrl(message)

  // 6. Revalidar (opcional, no hay persistencia)
  revalidatePath('/checkout')

  return { success: true, whatsappUrl }
}
