'use client'

import Link from 'next/link'
import { useCart } from '@/app/cart-context'

export function Header() {
  const { items } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/menu" className="text-xl font-bold text-green-600">
          WappCart
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/menu"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Menú
          </Link>
          <Link
            href="/checkout"
            className="relative text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Carrito
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
