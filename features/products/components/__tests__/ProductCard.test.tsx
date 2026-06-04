import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from '../ProductCard'
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

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Empanada de Carne',
  slug: 'empanada-carne',
  category: 'empanadas',
  description: 'Empanada rellena de carne cortada a cuchillo',
  price: 800,
  image: 'https://example.com/empanada.jpg',
  available: true,
}

const unavailableProduct: Product = {
  ...mockProduct,
  id: 'prod-2',
  name: 'Empanada Agotada',
  slug: 'empanada-agotada',
  available: false,
}

describe('ProductCard', () => {
  it('should render product name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Empanada de Carne')).toBeDefined()
  })

  it('should render formatted price', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText((content) => content.includes('800,00'))).toBeDefined()
  })

  it('should render product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />)
    const image = screen.getByAltText('Empanada de Carne')
    expect(image).toBeDefined()
    expect(image.getAttribute('src')).toBe('https://example.com/empanada.jpg')
  })

  it('should render "Disponible" badge for available products', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Disponible')).toBeDefined()
  })

  it('should render "Agotado" badge for unavailable products', () => {
    render(<ProductCard product={unavailableProduct} />)
    expect(screen.getByText('Agotado')).toBeDefined()
  })

  it('should render "No disponible" overlay for unavailable products', () => {
    render(<ProductCard product={unavailableProduct} />)
    expect(screen.getByText('No disponible')).toBeDefined()
  })

  it('should link to product detail page', () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/menu/empanada-carne')
  })
})
