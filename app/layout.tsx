import type { Metadata } from 'next'
import { CartProvider } from '@/lib/cart-context'
import { Header } from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'WappCart',
  description: 'Pedí tu comida favorita por WhatsApp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full bg-neutral-50 font-sans antialiased">
        <CartProvider>
          <Header />
          <main className="max-w-3xl mx-auto px-4 py-6">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}
