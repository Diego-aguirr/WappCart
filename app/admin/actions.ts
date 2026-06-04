'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { z } from 'zod'

const checkboxBoolean = z.preprocess(
  (val) => {
    if (typeof val === 'string') return val === 'true'
    if (typeof val === 'boolean') return val
    return val
  },
  z.boolean().default(true)
)

const ProductSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  price: z.coerce.number().positive(),
  image: z.string().min(1),
  category: z.string().min(1),
  available: checkboxBoolean,
})

export type ActionState =
  | { error: string | Record<string, string[]> }
  | { success: boolean }
  | null

export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const data = Object.fromEntries(formData)
  const result = ProductSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    await prisma.product.create({ data: result.data })
  } catch (error) {
    return { error: 'Failed to create product' }
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateProduct(
  id: string,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()

  const data = Object.fromEntries(formData)
  const result = ProductSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    await prisma.product.update({ where: { id }, data: result.data })
  } catch (error) {
    return { error: 'Failed to update product' }
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteProduct(id: string): Promise<ActionState> {
  await requireAdmin()

  try {
    await prisma.product.delete({ where: { id } })
  } catch (error) {
    return { error: 'Failed to delete product' }
  }

  revalidatePath('/admin')
  return { success: true }
}
