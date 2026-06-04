'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export function Header() {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/menu" className="text-lg font-bold text-green-700">
          WappCart
        </Link>

        <Link href="/checkout" className="relative text-sm font-medium text-neutral-700">
          🛒 Carrito
          {count > 0 && (
            <span className="absolute -right-3 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
