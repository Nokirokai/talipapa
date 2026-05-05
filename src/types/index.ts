export type Unit = 'kg' | 'pc' | 'bundle' | 'tali' | 'dozen' | 'liter'
export type PaymentMethod = 'cash' | 'utang'
export type DiscountType = 'percent' | 'fixed'

export interface Category {
  id: string
  name: string
  emoji: string
  color_hex: string
  sort_order: number
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string
  unit: Unit
  price: number
  stock_qty: number
  low_stock_threshold: number
  image_url: string | null
  barcode: string
  is_active: boolean
  created_at: string
}

export interface Vendor {
  id: string
  name: string
  stall_no: string
  contact: string
  specialization: string
}

export interface Discount {
  id: string
  name: string
  type: DiscountType
  value: number
  is_active: boolean
}

export interface Transaction {
  id: string
  txn_no: string
  cashier_id: string | null
  subtotal: number
  discount_amount: number
  discount_type: string | null
  total: number
  amount_tendered: number
  change_amount: number
  payment_method: PaymentMethod
  status: string
  notes: string | null
  created_at: string
}

export interface TransactionItem {
  id: string
  transaction_id: string
  product_id: string
  product_name: string
  unit: Unit
  qty: number
  unit_price: number
  subtotal: number
}

export interface DailySummary {
  id: string
  report_date: string
  gross_sales: number
  net_sales: number
  total_transactions: number
  total_items_sold: number
  top_product_id: string | null
}

export interface CartItem {
  product: Product
  qty: number
}

export interface Receipt {
  transaction: Transaction
  items: TransactionItem[]
}

export interface StoreSettings {
  storeName: string
  address: string
  receiptFooter: string
}
