import type { Product, Category } from './types'

const SHEET_ID = '18EoDMw922wrOVGS-i7vbgIUv3jLXwKS9VmYt4SUlhCY'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`

type SheetRow = {
  id: string
  name: string
  category: string
  descripcion: string
  price: string
  image: string
  avaible: string
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function parseCsv(csv: string): SheetRow[] {
  const lines = csv.split('\n').filter((line) => line.trim())
  if (lines.length < 2) return []

  const headers = parseCsvLine(lines[0])
  const rows: SheetRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row as unknown as SheetRow)
  }

  return rows
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function mapRowToProduct(row: SheetRow): Product {
  return {
    id: row.id,
    name: row.name.replace(/,\s*$/, ''), // Limpiar coma final
    slug: slugify(row.name),
    category: row.category.toLowerCase(),
    description: row.descripcion,
    price: parseInt(row.price, 10) || 0,
    image: row.image,
    available: row.avaible.toUpperCase() === 'TRUE',
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(SHEET_URL, {
      next: { revalidate: 300 }, // Cache 5 minutos
    })

    if (!response.ok) {
      console.error('Error fetching sheet:', response.status)
      return []
    }

    const csv = await response.text()
    const rows = parseCsv(csv)
    return rows.map(mapRowToProduct)
  } catch (error) {
    console.error('Error parsing sheet data:', error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.slug === slug) ?? null
}

export async function getCategories(): Promise<Category[]> {
  const products = await getProducts()
  const categoryMap = new Map<string, string>()

  products.forEach((product) => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, product.category)
    }
  })

  return Array.from(categoryMap.entries()).map(([slug, name]) => ({
    id: slug,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    slug,
  }))
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((p) => p.category === categorySlug)
}
