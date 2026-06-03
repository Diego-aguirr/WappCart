export type Product = {
  id: string
  name: string
  slug: string
  category: string
  description: string
  price: number
  image: string
  available: boolean
}

export type Category = {
  id: string
  name: string
  slug: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export type Order = {
  customerName: string
  phone: string
  address: string
  notes?: string
  items: CartItem[]
  total: number
}
