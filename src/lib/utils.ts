import type { CartItem, Discount, Product } from '../types'

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export const formatPeso = (value: number) =>
  new Intl.NumberFormat('fil-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)

export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('fil-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(typeof date === 'string' ? new Date(date) : date)

export const generateTxnNo = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const suffix = String(Math.floor(1000 + Math.random() * 9000))
  return `TXN-${y}${m}${d}-${suffix}`
}

export const getProductEmoji = (product: Product) => {
  const name = product.name.toLowerCase()
  if (['bangus', 'tilapia', 'galunggong', 'pusit', 'hipon', 'tahong'].some((word) => name.includes(word))) return '🐟'
  if (['baboy', 'baka', 'manok', 'liempo', 'paa'].some((word) => name.includes(word))) return '🥩'
  if (['kangkong', 'ampalaya', 'kamatis', 'talong', 'sitaw', 'pechay'].some((word) => name.includes(word))) return '🥬'
  if (['saging', 'mangga', 'papaya', 'pakwan', 'calamansi'].some((word) => name.includes(word))) return '🍋'
  if (name.includes('itlog')) return '🥚'
  if (['bawang', 'luya', 'sibuyas', 'sili'].some((word) => name.includes(word))) return '🧄'
  if (['tubig', 'juice', 'softdrinks'].some((word) => name.includes(word))) return '🧃'
  return '🛒'
}

export const stockTone = (product: Product) => {
  if (product.stock_qty <= 0) return 'red'
  if (product.stock_qty <= product.low_stock_threshold) return 'yellow'
  return 'green'
}

export const computeCart = (items: CartItem[], discount?: Discount | null) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0)
  const discountAmount =
    discount?.is_active
      ? discount.type === 'percent'
        ? subtotal * (discount.value / 100)
        : Math.min(discount.value, subtotal)
      : 0
  return {
    subtotal,
    discountAmount,
    total: Math.max(0, subtotal - discountAmount),
  }
}

export const downloadCsv = (filename: string, rows: Array<Record<string, string | number | null>>) => {
  const headers = Object.keys(rows[0] ?? { empty: '' })
  const escape = (value: string | number | null) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
