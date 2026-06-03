import type { Product, Category } from '@/types'
import { mockProducts, mockCategories } from './__mocks__/data'

export async function getProducts(): Promise<Product[]> {
  // TODO: Replace with real Google Sheets implementation
  return mockProducts
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  // TODO: Replace with real Google Sheets implementation
  const product = mockProducts.find((p) => p.slug === slug)
  return product ?? null
}

export async function getCategories(): Promise<Category[]> {
  // TODO: Replace with real Google Sheets implementation
  return mockCategories
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  // TODO: Replace with real Google Sheets implementation
  return mockProducts.filter((p) => p.category === categorySlug)
}
