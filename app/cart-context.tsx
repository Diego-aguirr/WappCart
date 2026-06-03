'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { CartItem, Product } from '@/lib/types'

type CartState = {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }

const CartContext = createContext<{
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existe = state.items.find(
        (item) => item.product.id === action.product.id
      )
      if (existe) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          ),
        }
      }
      return {
        items: [...state.items, { product: action.product, quantity: action.quantity }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((item) => item.product.id !== action.productId),
      }
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            (item) => item.product.id !== action.productId
          ),
        }
      }
      return {
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      }
    case 'CLEAR_CART':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Cargar carrito de localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const items = JSON.parse(saved) as CartItem[]
        items.forEach((item) =>
          dispatch({ type: 'ADD_ITEM', product: item.product, quantity: item.quantity })
        )
      } catch {
        // Ignorar datos corruptos
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product: Product, quantity = 1) =>
    dispatch({ type: 'ADD_ITEM', product, quantity })

  const removeItem = (productId: string) =>
    dispatch({ type: 'REMOVE_ITEM', productId })

  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const getTotal = () =>
    state.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, getTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
