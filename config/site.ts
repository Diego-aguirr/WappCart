export const siteConfig = {
  name: 'WappCart',
  description:
    'Tu tienda online favorita. Pedí por WhatsApp y recibí en tu puerta.',
  currency: 'ARS',
  currencySymbol: '$',
  locale: 'es-AR',
  whatsapp: {
    baseUrl: 'https://wa.me',
    messageTemplate: (items: string, total: string) =>
      `Hola! Quiero hacer un pedido:\n\n${items}\n\nTotal: ${total}`,
  },
} as const
