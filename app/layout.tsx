import type { Metadata } from 'next'
import { CartProvider } from '@/features/cart/provider/CartProvider'
import { Header } from '@/components/layout/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'WappCart',
  description: 'Tu tienda online favorita. Pedí por WhatsApp y recibí en tu puerta.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50">
        <CartProvider>
          <Header />
          <main className="flex-1 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
