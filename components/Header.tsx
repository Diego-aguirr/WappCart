'use client'

import Link from 'next/link'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '@/lib/cart-context'

export function Header() {
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/menu" className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <img src="/Food/logo.png" alt="Restobar" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-xl font-black tracking-tighter text-neutral-900 uppercase">
            Restobar
          </span>
        </Link>

        <Link href="/checkout" className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors">
          <FaShoppingCart className="w-5 h-5 text-neutral-900" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
