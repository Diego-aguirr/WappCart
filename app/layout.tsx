import type { Metadata, Viewport } from 'next'
import { CartProvider } from '@/lib/cart-context'
import { Header } from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'WappCart | Pedí por WhatsApp',
    template: '%s | WappCart',
  },
  description: 'Tu restaurante favorito. Pedí por WhatsApp y te lo llevamos a domicilio.',
  keywords: ['restaurante', 'delivery', 'comida', 'whatsapp', 'pedido', 'domicilio'],
  authors: [{ name: 'WappCart' }],
  creator: 'WappCart',
  publisher: 'WappCart',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'WappCart',
    title: 'WappCart | Pedí por WhatsApp',
    description: 'Tu restaurante favorito. Pedí por WhatsApp y te lo llevamos a domicilio.',
    images: [
      {
        url: '/Food/logo.png',
        width: 800,
        height: 800,
        alt: 'WappCart - Pedí por WhatsApp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WappCart | Pedí por WhatsApp',
    description: 'Tu restaurante favorito. Pedí por WhatsApp y te lo llevamos a domicilio.',
    images: ['/Food/logo.png'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/Food/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#171717',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
