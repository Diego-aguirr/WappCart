import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  description: z.string(),
  price: z.number().nonnegative(),
  image: z.string(),
  available: z.boolean(),
})

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
})

export const CartItemSchema = z.object({
  product: ProductSchema,
  quantity: z.number().int().positive(),
})

export const OrderSchema = z.object({
  customerName: z.string().min(1).max(100),
  phone: z.string().regex(/^\+?\d{10,15}$/),
  address: z.string().min(5).max(200),
  notes: z.string().max(500).optional(),
  products: z.array(CartItemSchema).min(1),
  total: z.number().nonnegative(),
})
