import type { Product, Category } from './types'

// Mock data — reemplazar con Google Sheets real cuando tengas credenciales
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Empanada de Carne',
    slug: 'empanada-de-carne',
    category: 'empanadas',
    description: 'Empanada criolla rellena de carne cortada a cuchillo, cebolla, huevo y aceitunas.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1604467707321-70d009801bf4?w=400',
    available: true,
  },
  {
    id: '2',
    name: 'Empanada de Jamón y Queso',
    slug: 'empanada-de-jamon-y-queso',
    category: 'empanadas',
    description: 'Empanada rellena de jamón cocido y queso cremoso.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1604467707321-70d009801bf4?w=400',
    available: true,
  },
  {
    id: '3',
    name: 'Milanesa Napolitana',
    slug: 'milanesa-napolitana',
    category: 'milanesas',
    description: 'Milanesa de ternera con salsa de tomate, jamón y queso gratinado.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1604467707321-70d009801bf4?w=400',
    available: true,
  },
  {
    id: '4',
    name: 'Pizza Muzzarella',
    slug: 'pizza-muzzarella',
    category: 'pizzas',
    description: 'Pizza con salsa de tomate, muzzarella y orégano.',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1604467707321-70d009801bf4?w=400',
    available: true,
  },
  {
    id: '5',
    name: 'Pizza Fugazzeta',
    slug: 'pizza-fugazzeta',
    category: 'pizzas',
    description: 'Pizza rellena de muzzarella con cebolla caramelizada.',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1604467707321-70d009801bf4?w=400',
    available: true,
  },
  {
    id: '6',
    name: 'Hamburguesa Clásica',
    slug: 'hamburguesa-clasica',
    category: 'hamburguesas',
    description: 'Hamburguesa de carne con lechuga, tomate, queso y salsa especial.',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1604467707321-70d009801bf4?w=400',
    available: false,
  },
]

const mockCategories: Category[] = [
  { id: '1', name: 'Empanadas', slug: 'empanadas' },
  { id: '2', name: 'Milanesas', slug: 'milanesas' },
  { id: '3', name: 'Pizzas', slug: 'pizzas' },
  { id: '4', name: 'Hamburguesas', slug: 'hamburguesas' },
]

// Funciones que leen de Google Sheets (o mock si no hay credenciales)
export async function getProducts(): Promise<Product[]> {
  // TODO: Cuando tengas credenciales, acá lees de Google Sheets
  return mockProducts
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = mockProducts.find((p) => p.slug === slug)
  return product ?? null
}

export async function getCategories(): Promise<Category[]> {
  return mockCategories
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return mockProducts.filter((p) => p.category === categorySlug)
}
