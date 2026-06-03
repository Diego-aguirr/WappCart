import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductDetail } from '../ProductDetail'
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
  description:
    'Empanada rellena de carne cortada a cuchillo, cebolla, huevo y aceitunas. Masa casera crujiente.',
  price: 800,
  image: 'https://example.com/empanada.jpg',
  available: true,
}

describe('ProductDetail', () => {
  it('should render product name', () => {
    render(<ProductDetail product={mockProduct} />)
    expect(screen.getByText('Empanada de Carne')).toBeDefined()
  })

  it('should render product description', () => {
    render(<ProductDetail product={mockProduct} />)
    expect(
      screen.getByText(
        'Empanada rellena de carne cortada a cuchillo, cebolla, huevo y aceitunas. Masa casera crujiente.'
      )
    ).toBeDefined()
  })

  it('should render formatted price', () => {
    render(<ProductDetail product={mockProduct} />)
    expect(screen.getByText((content) => content.includes('800,00'))).toBeDefined()
  })

  it('should render product category', () => {
    render(<ProductDetail product={mockProduct} />)
    expect(screen.getByText('empanadas')).toBeDefined()
  })

  it('should render product image with correct alt text', () => {
    render(<ProductDetail product={mockProduct} />)
    const image = screen.getByAltText('Empanada de Carne')
    expect(image).toBeDefined()
    expect(image.getAttribute('src')).toBe('https://example.com/empanada.jpg')
  })

  it('should render "Disponible" badge for available products', () => {
    render(<ProductDetail product={mockProduct} />)
    expect(screen.getByText('Disponible')).toBeDefined()
  })

  it('should render "No disponible" badge for unavailable products', () => {
    const unavailable = { ...mockProduct, available: false }
    render(<ProductDetail product={unavailable} />)
    expect(screen.getByText('No disponible')).toBeDefined()
  })

  it('should render back link to menu', () => {
    render(<ProductDetail product={mockProduct} />)
    const backLink = screen.getByText('← Volver al menú')
    expect(backLink).toBeDefined()
    expect(backLink.closest('a')?.getAttribute('href')).toBe('/menu')
  })

  it('should render product with minimal fields', () => {
    const minimalProduct: Product = {
      id: 'prod-min',
      name: 'Test Product',
      slug: 'test-product',
      category: 'test',
      description: 'Short desc',
      price: 100,
      image: 'https://example.com/test.jpg',
      available: true,
    }
    render(<ProductDetail product={minimalProduct} />)
    expect(screen.getByText('Test Product')).toBeDefined()
    expect(screen.getByText('Short desc')).toBeDefined()
    expect(screen.getByText((content) => content.includes('100,00'))).toBeDefined()
  })
})
