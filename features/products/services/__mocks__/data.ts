import type { Product, Category } from '@/types'

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Empanadas', slug: 'empanadas' },
  { id: 'cat-2', name: 'Milanesas', slug: 'milanesas' },
  { id: 'cat-3', name: 'Pizzas', slug: 'pizzas' },
  { id: 'cat-4', name: 'Bebidas', slug: 'bebidas' },
]

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Empanada de Carne',
    slug: 'empanada-carne',
    category: 'empanadas',
    description:
      'Empanada rellena de carne cortada a cuchillo, cebolla, huevo y aceitunas. Masa casera crujiente.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1604467707321-70d009801bf4',
    available: true,
  },
  {
    id: 'prod-2',
    name: 'Empanada de Jamón y Queso',
    slug: 'empanada-jamon-queso',
    category: 'empanadas',
    description:
      'Empanada rellena de jamón cocido y queso cremoso. La clásica que nunca falla.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1604467707321-70d009801bf4',
    available: true,
  },
  {
    id: 'prod-3',
    name: 'Empanada de Humita',
    slug: 'empanada-humita',
    category: 'empanadas',
    description:
      'Empanada rellena de humita de choclo con salsa criolla. Vegetariana.',
    price: 850,
    image: 'https://images.unsplash.com/photo-1604467707321-70d009801bf4',
    available: true,
  },
  {
    id: 'prod-4',
    name: 'Milanesa Napolitana',
    slug: 'milanesa-napolitana',
    category: 'milanesas',
    description:
      'Milanesa de carne con salsa de tomate, jamón y queso gratinado. Acompañada con papas fritas.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    available: true,
  },
  {
    id: 'prod-5',
    name: 'Milanesa a la Napolitana con Puré',
    slug: 'milanesa-napolitana-pure',
    category: 'milanesas',
    description:
      'Milanesa napolitana acompañada con puré de papas casero.',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    available: false,
  },
  {
    id: 'prod-6',
    name: 'Pizza Muzzarella',
    slug: 'pizza-muzzarella',
    category: 'pizzas',
    description:
      'Pizza con salsa de tomate casera y abundante muzzarella. La favorita de la casa.',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    available: true,
  },
  {
    id: 'prod-7',
    name: 'Pizza Fugazzeta',
    slug: 'pizza-fugazzeta',
    category: 'pizzas',
    description:
      'Pizza rellena de muzzarella con cebolla caramelizada por encima. Clásica porteña.',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    available: true,
  },
  {
    id: 'prod-8',
    name: 'Coca-Cola 500ml',
    slug: 'coca-cola-500ml',
    category: 'bebidas',
    description: 'Coca-Cola 500ml. Bien fría para acompañar tu pedido.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
    available: true,
  },
  {
    id: 'prod-9',
    name: 'Agua Mineral 500ml',
    slug: 'agua-mineral-500ml',
    category: 'bebidas',
    description: 'Agua mineral sin gas 500ml.',
    price: 400,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d',
    available: true,
  },
]
