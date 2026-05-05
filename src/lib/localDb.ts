import { categories, discounts, products as seededProducts, transactionItems, transactions } from './sampleData'
import type { Product, Receipt, Transaction, TransactionItem } from '../types'
import { generateTxnNo } from './utils'

const PRODUCT_KEY = 'talipapa-products'
const TXN_KEY = 'talipapa-transactions'
const TXN_ITEMS_KEY = 'talipapa-transaction-items'

const read = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

const write = <T>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value))

export const localDb = {
  categories: async () => categories,
  discounts: async () => discounts,
  products: async () => read<Product[]>(PRODUCT_KEY, seededProducts),
  transactions: async () => read<Transaction[]>(TXN_KEY, transactions),
  transactionItems: async () => read<TransactionItem[]>(TXN_ITEMS_KEY, transactionItems),
  upsertProduct: async (product: Product) => {
    const rows = read<Product[]>(PRODUCT_KEY, seededProducts)
    const next = rows.some((row) => row.id === product.id)
      ? rows.map((row) => (row.id === product.id ? product : row))
      : [{ ...product, id: product.id || crypto.randomUUID(), created_at: new Date().toISOString() }, ...rows]
    write(PRODUCT_KEY, next)
    return product
  },
  deleteProduct: async (productId: string) => {
    const rows = read<Product[]>(PRODUCT_KEY, seededProducts)
    write(PRODUCT_KEY, rows.filter((row) => row.id !== productId))
    return productId
  },
  adjustStock: async (productId: string, delta: number) => {
    const rows = read<Product[]>(PRODUCT_KEY, seededProducts)
    const next = rows.map((row) =>
      row.id === productId ? { ...row, stock_qty: Math.max(0, Number(row.stock_qty) + delta) } : row,
    )
    write(PRODUCT_KEY, next)
    return next.find((row) => row.id === productId)
  },
  upsertTransaction: async (transaction: Transaction) => {
    const rows = read<Transaction[]>(TXN_KEY, transactions)
    const next = rows.some((row) => row.id === transaction.id)
      ? rows.map((row) => (row.id === transaction.id ? transaction : row))
      : [transaction, ...rows]
    write(TXN_KEY, next)
    return transaction
  },
  processTransaction: async (payload: {
    items: Array<{ product: Product; qty: number }>
    subtotal: number
    discountAmount: number
    discountType?: string | null
    total: number
    amountTendered: number
    changeAmount: number
    paymentMethod: Transaction['payment_method']
    cashierId?: string | null
    notes?: string | null
  }): Promise<Receipt> => {
    const productRows = read<Product[]>(PRODUCT_KEY, seededProducts)
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      txn_no: generateTxnNo(),
      cashier_id: payload.cashierId ?? null,
      subtotal: payload.subtotal,
      discount_amount: payload.discountAmount,
      discount_type: payload.discountType ?? null,
      total: payload.total,
      amount_tendered: payload.amountTendered,
      change_amount: payload.changeAmount,
      payment_method: payload.paymentMethod,
      payment_status: payload.paymentMethod === 'cash' ? 'paid' : 'unpaid',
      status: 'completed',
      notes: payload.notes ?? null,
      created_at: new Date().toISOString(),
    }
    const items: TransactionItem[] = payload.items.map(({ product, qty }) => ({
      id: crypto.randomUUID(),
      transaction_id: transaction.id,
      product_id: product.id,
      product_name: product.name,
      unit: product.unit,
      qty,
      unit_price: product.price,
      subtotal: product.price * qty,
    }))
    const nextProducts = productRows.map((product) => {
      const item = payload.items.find((row) => row.product.id === product.id)
      return item ? { ...product, stock_qty: Math.max(0, product.stock_qty - item.qty) } : product
    })
    write(PRODUCT_KEY, nextProducts)
    write(TXN_KEY, [transaction, ...read<Transaction[]>(TXN_KEY, transactions)])
    write(TXN_ITEMS_KEY, [...items, ...read<TransactionItem[]>(TXN_ITEMS_KEY, transactionItems)])
    return { transaction, items }
  },
}
