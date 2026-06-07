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

export type CartItem = {
  product: Product
  quantity: number
}
