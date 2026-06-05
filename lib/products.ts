import { prisma } from './prisma'
import type { Product } from './types'

type PrismaProduct = Awaited<ReturnType<typeof prisma.product.findFirst>>

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
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
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
