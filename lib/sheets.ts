import type { Product } from '@/lib/types'

const SHEET_ID = '18EoDMw922wrOVGS-i7vbgIUv3jLXwKS9VmYt4SUlhCY'
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`

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

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(URL, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const rows = parseCsv(await res.text())
    return rows.map(r => ({
      id: r.id,
      name: r.name?.replace(/,\s*$/, '') || '',
      slug: slugify(r.name || ''),
      category: (r.category || '').toLowerCase(),
      description: r.descripcion || r.description || '',
      price: parseInt(r.price, 10) || 0,
      available: (r.avaible || r.available || '').toUpperCase() === 'TRUE',
    }))
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find(p => p.slug === slug) || null
}

export function groupByCategory(products: Product[]): Map<string, Product[]> {
  const groups = new Map<string, Product[]>()
  products.forEach(p => {
    const list = groups.get(p.category) || []
    list.push(p)
    groups.set(p.category, list)
  })
  return groups
}
