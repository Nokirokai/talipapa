import { create } from 'zustand'
import type { CartItem, Discount, PaymentMethod, Product } from '../types'

interface CartState {
  items: CartItem[]
  discount: Discount | null
  paymentMethod: PaymentMethod
  amountTendered: number
  customerName: string
  customerDetails: string
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clearCart: () => void
  setDiscount: (discount: Discount | null) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setAmountTendered: (amount: number) => void
  setCustomerName: (name: string) => void
  setCustomerDetails: (details: string) => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  discount: null,
  paymentMethod: 'cash',
  amountTendered: 0,
  customerName: '',
  customerDetails: '',
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id)
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, qty: Math.min(product.stock_qty, item.qty + 1) }
              : item,
          ),
        }
      }
      return { items: [{ product, qty: 1 }, ...state.items] }
    }),
  removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),
  setQty: (productId, qty) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, qty: Math.max(0, Math.min(item.product.stock_qty, qty)) }
            : item,
        )
        .filter((item) => item.qty > 0),
    })),
  clearCart: () => set({ items: [], discount: null, amountTendered: 0, paymentMethod: 'cash', customerName: '', customerDetails: '' }),
  setDiscount: (discount) => set({ discount }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setAmountTendered: (amountTendered) => set({ amountTendered }),
  setCustomerName: (customerName) => set({ customerName }),
  setCustomerDetails: (customerDetails) => set({ customerDetails }),
}))
