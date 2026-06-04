import { describe, it, expect } from 'vitest'
import {
  getProducts,
  getProductBySlug,
  getCategories,
  getProductsByCategory,
} from '../product-service'
import { mockProducts, mockCategories } from '../__mocks__/data'

describe('product-service', () => {
  describe('getProducts', () => {
    it('should return all mock products', async () => {
      const products = await getProducts()
      expect(products).toHaveLength(mockProducts.length)
      expect(products).toEqual(mockProducts)
    })

    it('should return products with required fields', async () => {
      const products = await getProducts()
      for (const product of products) {
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('slug')
        expect(product).toHaveProperty('category')
        expect(product).toHaveProperty('description')
        expect(product).toHaveProperty('price')
        expect(product).toHaveProperty('image')
        expect(product).toHaveProperty('available')
      }
    })
  })

  describe('getProductBySlug', () => {
    it('should return product when slug matches', async () => {
      const product = await getProductBySlug('empanada-carne')
      expect(product).not.toBeNull()
      expect(product?.name).toBe('Empanada de Carne')
      expect(product?.slug).toBe('empanada-carne')
    })

    it('should return null when slug does not match', async () => {
      const product = await getProductBySlug('nonexistent-item')
      expect(product).toBeNull()
    })

    it('should return null for empty slug', async () => {
      const product = await getProductBySlug('')
      expect(product).toBeNull()
    })
  })

  describe('getCategories', () => {
    it('should return all mock categories', async () => {
      const categories = await getCategories()
      expect(categories).toHaveLength(mockCategories.length)
      expect(categories).toEqual(mockCategories)
    })

    it('should return categories with required fields', async () => {
      const categories = await getCategories()
      for (const category of categories) {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('slug')
      }
    })
  })

  describe('getProductsByCategory', () => {
    it('should return products matching category slug', async () => {
      const empanadas = await getProductsByCategory('empanadas')
      expect(empanadas.length).toBeGreaterThan(0)
      for (const product of empanadas) {
        expect(product.category).toBe('empanadas')
      }
    })

    it('should return empty array for non-existent category', async () => {
      const products = await getProductsByCategory('nonexistent')
      expect(products).toHaveLength(0)
    })

    it('should return pizzas correctly', async () => {
      const pizzas = await getProductsByCategory('pizzas')
      expect(pizzas).toHaveLength(2)
      expect(pizzas[0].name).toBe('Pizza Muzzarella')
      expect(pizzas[1].name).toBe('Pizza Fugazzeta')
    })
  })
})
