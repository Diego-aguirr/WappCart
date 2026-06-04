import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/menu" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/Food/logo.png"
              alt="WappCart"
              fill
              className="object-contain"
              sizes="32px"
            />
          </div>
          <span className="text-lg font-bold text-green-700">WappCart</span>
        </Link>

        <Link href="/checkout" className="relative text-sm font-medium text-neutral-700 hover:text-green-700 transition-colors">
          🛒 Carrito
        </Link>
      </div>
    </header>
  )
}
