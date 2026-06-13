import { prisma } from './prisma'
import { deleteImage } from './cloudinary'
import type { Product } from './types'

type PrismaProduct = Awaited<ReturnType<typeof prisma.product.findFirst>>

/**
 * Extract Cloudinary public ID from a Cloudinary URL.
 * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/wappcart/products/abc.jpg
 * Returns: wappcart/products/abc
 */
function extractCloudinaryPublicId(url: string): string | null {
  // Only process Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) {
    return null
  }

  // Extract public ID between /upload/ and the file extension
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/)
  const publicId = match ? match[1] : null

  // Validate public ID format (must start with wappcart/)
  if (publicId && !publicId.startsWith('wappcart/')) {
    return null
  }

  return publicId
}

/**
 * Delete image from Cloudinary if it's a Cloudinary URL.
 * Silently fails if deletion fails (non-critical).
 */
async function cleanupCloudinaryImage(url: string): Promise<void> {
  try {
    const publicId = extractCloudinaryPublicId(url)
    if (publicId) {
      await deleteImage(publicId)
    }
  } catch (error) {
    // Log but don't throw - image cleanup is non-critical
    console.error('Failed to delete Cloudinary image:', error)
  }
}

function mapProduct(p: PrismaProduct): Product | null {
  if (!p) return null
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    image: p.image,
    category: p.category,
    available: p.available,
  }
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: { name: 'asc' },
  })
  return products.map(p => mapProduct(p)!)
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, available: true },
  })
  return mapProduct(product)
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  })
  return mapProduct(product)
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: [
      { available: 'desc' },
      { createdAt: 'desc' },
    ],
  })
  return products.map(p => mapProduct(p)!)
}

export async function groupByCategory(products: Product[]) {
  const groups = new Map<string, Product[]>()
  products.forEach((p) => {
    const list = groups.get(p.category) || []
    list.push(p)
    groups.set(p.category, list)
  })
  return groups
}

export async function createProduct(data: {
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: string
  available?: boolean
}) {
  return prisma.product.create({ data })
}

export async function updateProduct(
  id: string,
  data: {
    name: string
    slug: string
    description: string
    price: number
    image: string
    category: string
    available?: boolean
  }
) {
  // Get current product to check if image changed
  const currentProduct = await prisma.product.findUnique({
    where: { id },
    select: { image: true },
  })

  // Update the product
  const updated = await prisma.product.update({ where: { id }, data })

  // If image changed, delete old image from Cloudinary (non-critical)
  if (currentProduct?.image && currentProduct.image !== data.image) {
    await cleanupCloudinaryImage(currentProduct.image)
  }

  return updated
}

export async function deleteProduct(id: string) {
  // Get the product first to get the image URL
  const product = await prisma.product.findUnique({
    where: { id },
    select: { image: true },
  })

  // Delete the product from database
  await prisma.product.delete({ where: { id } })

  // Cleanup image from Cloudinary (non-critical, don't throw)
  if (product?.image) {
    await cleanupCloudinaryImage(product.image)
  }
}

export async function toggleAvailability(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { available: true },
  })
  if (!product) throw new Error('Product not found')
  return prisma.product.update({
    where: { id },
    data: { available: !product.available },
  })
}
