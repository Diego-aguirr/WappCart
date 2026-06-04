import type { Product, Category } from '@/lib/types'

const SHEET_ID = '18EoDMw922wrOVGS-i7vbgIUv3jLXwKS9VmYt4SUlhCY'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`

function parseCsv(csv: string): Record<string, string>[] {
  const lines = csv.split('\n').filter(Boolean)
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  
  return lines.slice(1).map(line => {
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = values[i] || '' })
    return row
  })
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'

function isValidImageUrl(url: string): boolean {
  if (!url) return false
  // Rechazar URLs de carpetas de Google Drive
  if (url.includes('drive.google.com/drive/folders')) return false
  if (url.includes('drive.google.com/open')) return false
  // Aceptar imágenes directas de Drive o cualquier otra URL
  return url.startsWith('http')
}

function mapRow(row: Record<string, string>): Product {
  const imageUrl = row.image?.trim() || ''
  
  return {
    id: row.id,
    name: row.name?.replace(/,\s*$/, '') || '',
    slug: slugify(row.name || ''),
    category: (row.category || '').toLowerCase(),
    description: row.descripcion || row.description || '',
    price: parseInt(row.price, 10) || 0,
    image: isValidImageUrl(imageUrl) ? imageUrl : DEFAULT_IMAGE,
    available: (row.avaible || row.available || '').toUpperCase() === 'TRUE',
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const csv = await res.text()
    return parseCsv(csv).map(mapRow)
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find(p => p.slug === slug) || null
}

export async function getCategories(): Promise<Category[]> {
  const products = await getProducts()
  const map = new Map<string, string>()
  products.forEach(p => { if (!map.has(p.category)) map.set(p.category, p.category) })
  return Array.from(map.entries()).map(([slug, name]) => ({
    id: slug,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    slug,
  }))
}
