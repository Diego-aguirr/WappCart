import Link from 'next/link'
import { siteConfig } from '@/config/site'
import { Container } from './Container'

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-neutral-900 hover:text-neutral-700"
          >
            {siteConfig.name}
          </Link>

          <ul className="flex items-center gap-6">
            <li>
              <Link
                href="/"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/menu"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Menú
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  )
}
