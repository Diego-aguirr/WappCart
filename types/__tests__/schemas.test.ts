import { describe, it, expect } from 'vitest'
import {
  ProductSchema,
  CategorySchema,
  CartItemSchema,
  OrderSchema,
} from '../schemas'

describe('ProductSchema', () => {
  const validProduct = {
    id: '1',
    name: 'Empanada de Carne',
    slug: 'empanada-carne',
    category: 'empanadas',
    description: 'Empanada rellena de carne cortada a cuchillo',
    price: 500,
    image: 'https://example.com/empanada.jpg',
    available: true,
  }

  it('should parse a valid product', () => {
    const result = ProductSchema.safeParse(validProduct)
    expect(result.success).toBe(true)
  })

  it('should accept zero price (free items)', () => {
    const result = ProductSchema.safeParse({ ...validProduct, price: 0 })
    expect(result.success).toBe(true)
  })

  it('should reject negative price', () => {
    const result = ProductSchema.safeParse({ ...validProduct, price: -10 })
    expect(result.success).toBe(false)
  })

  it('should reject empty name', () => {
    const result = ProductSchema.safeParse({ ...validProduct, name: '' })
    expect(result.success).toBe(false)
  })

  it('should accept empty description', () => {
    const result = ProductSchema.safeParse({ ...validProduct, description: '' })
    expect(result.success).toBe(true)
  })
})

describe('CategorySchema', () => {
  const validCategory = {
    id: 'cat-1',
    name: 'Empanadas',
    slug: 'empanadas',
  }

  it('should parse a valid category', () => {
    const result = CategorySchema.safeParse(validCategory)
    expect(result.success).toBe(true)
  })

  it('should reject empty slug', () => {
    const result = CategorySchema.safeParse({ ...validCategory, slug: '' })
    expect(result.success).toBe(false)
  })
})

describe('CartItemSchema', () => {
  const validProduct = {
    id: '1',
    name: 'Empanada de Carne',
    slug: 'empanada-carne',
    category: 'empanadas',
    description: 'Empanada rellena de carne',
    price: 500,
    image: 'https://example.com/empanada.jpg',
    available: true,
  }

  const validCartItem = {
    product: validProduct,
    quantity: 3,
  }

  it('should parse a valid cart item', () => {
    const result = CartItemSchema.safeParse(validCartItem)
    expect(result.success).toBe(true)
  })

  it('should reject zero quantity', () => {
    const result = CartItemSchema.safeParse({ ...validCartItem, quantity: 0 })
    expect(result.success).toBe(false)
  })

  it('should reject negative quantity', () => {
    const result = CartItemSchema.safeParse({ ...validCartItem, quantity: -1 })
    expect(result.success).toBe(false)
  })

  it('should reject fractional quantity', () => {
    const result = CartItemSchema.safeParse({ ...validCartItem, quantity: 1.5 })
    expect(result.success).toBe(false)
  })
})

describe('OrderSchema', () => {
  const validProduct = {
    id: '1',
    name: 'Empanada de Carne',
    slug: 'empanada-carne',
    category: 'empanadas',
    description: 'Empanada rellena de carne',
    price: 500,
    image: 'https://example.com/empanada.jpg',
    available: true,
  }

  const validOrder = {
    customerName: 'Juan Pérez',
    phone: '5491112345678',
    address: 'Av. Corrientes 1234, Buenos Aires',
    products: [{ product: validProduct, quantity: 3 }],
    total: 1500,
  }

  it('should parse a valid order', () => {
    const result = OrderSchema.safeParse(validOrder)
    expect(result.success).toBe(true)
  })

  it('should parse order without notes', () => {
    const result = OrderSchema.safeParse(validOrder)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.notes).toBeUndefined()
    }
  })

  it('should parse order with notes', () => {
    const result = OrderSchema.safeParse({
      ...validOrder,
      notes: 'Tocar timbre 2 veces',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty customer name', () => {
    const result = OrderSchema.safeParse({ ...validOrder, customerName: '' })
    expect(result.success).toBe(false)
  })

  it('should reject empty products array', () => {
    const result = OrderSchema.safeParse({ ...validOrder, products: [] })
    expect(result.success).toBe(false)
  })

  it('should reject negative total', () => {
    const result = OrderSchema.safeParse({ ...validOrder, total: -100 })
    expect(result.success).toBe(false)
  })
})
