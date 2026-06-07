'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { requireAuth } from '@/lib/admin-auth'
import { createProduct, updateProduct, deleteProduct, toggleAvailability } from '@/lib/products'
import { COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/constants'
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
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  image: z.string().min(1, 'Image is required'),
  category: z.string().min(1),
  available: checkboxBoolean,
})

export type ActionState =
  | { error: string | Record<string, string[]> }
  | { success: boolean }
  | null

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 })
}

export async function createProductAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAuth()

  const data = Object.fromEntries(formData)
  const result = ProductSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    await createProduct(result.data)
  } catch (error) {
    return { error: 'Failed to create product' }
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateProductAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAuth()

  const data = Object.fromEntries(formData)
  const result = ProductSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    await updateProduct(id, result.data)
  } catch (error) {
    return { error: 'Failed to update product' }
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteProductAction(id: string): Promise<ActionState> {
  await requireAuth()

  try {
    await deleteProduct(id)
  } catch (error) {
    return { error: 'Failed to delete product' }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function toggleProductAvailability(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAuth()

  const id = formData.get('id') as string
  if (!id) return { error: 'Product ID missing' }

  try {
    await toggleAvailability(id)
  } catch (error) {
    return { error: 'Failed to update availability' }
  }

  revalidatePath('/admin')
  return { success: true }
}
