import type { CartItem } from './types'

export function generateWhatsAppMessage(
  customerName: string,
  phone: string,
  address: string,
  items: CartItem[],
  total: number,
  notes?: string
): string {
  const lines = [
    `🛒 *Nuevo Pedido*`,
    ``,
    `👤 *Cliente:* ${customerName}`,
    `📱 *Teléfono:* ${phone}`,
    `📍 *Dirección:* ${address}`,
    ``,
    `📋 *Pedido:*`,
    ...items.map(
      (item) =>
        `  • ${item.quantity}x ${item.product.name} — $${(item.product.price * item.quantity).toLocaleString('es-AR')}`
    ),
    ``,
    `💰 *Total: $${total.toLocaleString('es-AR')}*`,
  ]

  if (notes) {
    lines.push(``, `📝 *Notas:* ${notes}`)
  }

  return lines.join('\n')
}

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message)
  const phone = process.env.WHATSAPP_NUMBER || '5491123456789'
  return `https://wa.me/${phone}?text=${encoded}`
}
