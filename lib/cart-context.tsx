'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { CartItem, Product } from '@/lib/types'

type CartState = { items: CartItem[] }

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR' }

const CartContext = createContext<{
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clear: () => void
  total: number
  count: number
} | null>(null)

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.product.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.product.id !== action.productId) }
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return { items: state.items.filter(i => i.product.id !== action.productId) }
      }
      return {
        items: state.items.map(i =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const items = JSON.parse(saved) as CartItem[]
        items.forEach(item => dispatch({ type: 'ADD_ITEM', product: item.product }))
        // Fix quantities after adding
        items.forEach(item => {
          if (item.quantity > 1) {
            dispatch({ type: 'UPDATE_QTY', productId: item.product.id, quantity: item.quantity })
          }
        })
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem: (p) => dispatch({ type: 'ADD_ITEM', product: p }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', productId: id }),
      updateQty: (id, q) => dispatch({ type: 'UPDATE_QTY', productId: id, quantity: q }),
      clear: () => dispatch({ type: 'CLEAR' }),
      total,
      count,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart dentro de CartProvider')
  return ctx
}
