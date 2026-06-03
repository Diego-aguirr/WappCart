import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductGrid } from '../ProductGrid'
import type { Product } from '@/types'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Empanada de Carne',
    slug: 'empanada-carne',
    category: 'empanadas',
    description: 'Empanada rellena de carne',
    price: 800,
    image: 'https://example.com/empanada.jpg',
    available: true,
  },
  {
    id: 'prod-2',
    name: 'Pizza Muzzarella',
    slug: 'pizza-muzzarella',
    category: 'pizzas',
    description: 'Pizza con muzzarella',
    price: 2200,
    image: 'https://example.com/pizza.jpg',
    available: true,
  },
]

describe('ProductGrid', () => {
  it('should render all products in the grid', () => {
    render(<ProductGrid products={mockProducts} />)
    expect(screen.getByText('Empanada de Carne')).toBeDefined()
    expect(screen.getByText('Pizza Muzzarella')).toBeDefined()
  })

  it('should render correct number of product cards', () => {
    render(<ProductGrid products={mockProducts} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
  })

  it('should render empty state when no products', () => {
    render(<ProductGrid products={[]} />)
    expect(
      screen.getByText('No hay productos disponibles en este momento.')
    ).toBeDefined()
  })

  it('should render grid container with correct classes', () => {
    const { container } = render(<ProductGrid products={mockProducts} />)
    const grid = container.firstChild as HTMLElement
    expect(grid.className).toContain('grid')
    expect(grid.className).toContain('grid-cols-1')
    expect(grid.className).toContain('sm:grid-cols-2')
    expect(grid.className).toContain('lg:grid-cols-3')
    expect(grid.className).toContain('xl:grid-cols-4')
  })
})
