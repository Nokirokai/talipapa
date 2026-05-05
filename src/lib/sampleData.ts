import type { Category, Discount, Product, Transaction, TransactionItem, Vendor } from '../types'

const now = new Date().toISOString()

export const categories: Category[] = [
  { id: 'cat-isda', name: 'Isda', emoji: '🐟', color_hex: '#0D9488', sort_order: 1 },
  { id: 'cat-karne', name: 'Karne', emoji: '🥩', color_hex: '#EF4444', sort_order: 2 },
  { id: 'cat-gulay', name: 'Gulay', emoji: '🥬', color_hex: '#22C55E', sort_order: 3 },
  { id: 'cat-prutas', name: 'Prutas', emoji: '🍋', color_hex: '#FBBF24', sort_order: 4 },
  { id: 'cat-itlog', name: 'Itlog at Manok', emoji: '🥚', color_hex: '#F59E0B', sort_order: 5 },
  { id: 'cat-sangkap', name: 'Sangkap', emoji: '🧄', color_hex: '#F97316', sort_order: 6 },
  { id: 'cat-paninda', name: 'Paninda', emoji: '🛒', color_hex: '#A855F7', sort_order: 7 },
  { id: 'cat-inumin', name: 'Inumin', emoji: '🧃', color_hex: '#38BDF8', sort_order: 8 },
]

const product = (
  id: string,
  category_id: string,
  name: string,
  unit: Product['unit'],
  price: number,
  stock_qty: number,
  description = 'Sariwang paninda mula sa talipapa.',
): Product => ({
  id,
  category_id,
  name,
  description,
  unit,
  price,
  stock_qty,
  low_stock_threshold: unit === 'kg' ? 5 : 10,
  image_url: null,
  barcode: `899${id.replace(/\D/g, '').padStart(8, '0')}`,
  is_active: true,
  created_at: now,
})

export const products: Product[] = [
  product('prod-001', 'cat-isda', 'Bangus', 'kg', 180, 28),
  product('prod-002', 'cat-isda', 'Tilapia', 'kg', 120, 35),
  product('prod-003', 'cat-isda', 'Galunggong', 'kg', 200, 18),
  product('prod-004', 'cat-isda', 'Pusit', 'kg', 350, 7),
  product('prod-005', 'cat-isda', 'Hipon', 'kg', 400, 6),
  product('prod-006', 'cat-karne', 'Baboy liempo', 'kg', 320, 20),
  product('prod-007', 'cat-karne', 'Baka', 'kg', 380, 14),
  product('prod-008', 'cat-karne', 'Manok', 'kg', 210, 26),
  product('prod-009', 'cat-karne', 'Pork kasim', 'kg', 300, 15),
  product('prod-010', 'cat-karne', 'Longganisa', 'tali', 95, 32),
  product('prod-011', 'cat-gulay', 'Kangkong', 'bundle', 20, 80),
  product('prod-012', 'cat-gulay', 'Ampalaya', 'pc', 35, 45),
  product('prod-013', 'cat-gulay', 'Kamatis', 'kg', 60, 22),
  product('prod-014', 'cat-gulay', 'Talong', 'pc', 25, 55),
  product('prod-015', 'cat-gulay', 'Sitaw', 'bundle', 30, 38),
  product('prod-016', 'cat-prutas', 'Saging Lakatan', 'dozen', 120, 18),
  product('prod-017', 'cat-prutas', 'Mangga', 'kg', 80, 30),
  product('prod-018', 'cat-prutas', 'Papaya', 'pc', 45, 21),
  product('prod-019', 'cat-prutas', 'Pakwan hiwa', 'pc', 35, 24),
  product('prod-020', 'cat-prutas', 'Calamansi', 'kg', 90, 12),
  product('prod-021', 'cat-itlog', 'Itlog', 'pc', 8, 240),
  product('prod-022', 'cat-itlog', 'Itlog', 'dozen', 90, 30),
  product('prod-023', 'cat-itlog', 'Chicken paa', 'kg', 180, 17),
  product('prod-024', 'cat-itlog', 'Chicken pakpak', 'kg', 190, 12),
  product('prod-025', 'cat-itlog', 'Balut', 'pc', 22, 60),
  product('prod-026', 'cat-sangkap', 'Bawang 100g', 'pc', 30, 42),
  product('prod-027', 'cat-sangkap', 'Luya', 'pc', 15, 65),
  product('prod-028', 'cat-sangkap', 'Sibuyas', 'kg', 70, 24),
  product('prod-029', 'cat-sangkap', 'Sili', 'bundle', 25, 34),
  product('prod-030', 'cat-sangkap', 'Paminta sachet', 'pc', 12, 90),
  product('prod-031', 'cat-paninda', 'Asin pack', 'pc', 15, 75),
  product('prod-032', 'cat-paninda', 'Toyo 350ml', 'liter', 45, 36),
  product('prod-033', 'cat-paninda', 'Patis 350ml', 'liter', 40, 32),
  product('prod-034', 'cat-paninda', 'Suka 350ml', 'liter', 35, 38),
  product('prod-035', 'cat-paninda', 'Mantika 1L', 'liter', 105, 20),
  product('prod-036', 'cat-inumin', 'Softdrinks 1.5L', 'liter', 75, 30),
  product('prod-037', 'cat-inumin', 'Mineral water', 'pc', 25, 48),
  product('prod-038', 'cat-inumin', 'Juice tetra pack', 'pc', 20, 64),
  product('prod-039', 'cat-inumin', 'Buko juice', 'pc', 35, 28),
  product('prod-040', 'cat-inumin', 'Iced tea litro', 'liter', 65, 22),
]

export const discounts: Discount[] = [
  { id: 'disc-none', name: 'Walang discount', type: 'fixed', value: 0, is_active: true },
  { id: 'disc-suki', name: 'Suki 5%', type: 'percent', value: 5, is_active: true },
  { id: 'disc-senior', name: 'Senior/PWD 20%', type: 'percent', value: 20, is_active: true },
  { id: 'disc-tingi', name: 'Tawad ₱10', type: 'fixed', value: 10, is_active: true },
]

export const vendors: Vendor[] = [
  { id: 'vendor-001', name: 'Aling Nena', stall_no: 'A1', contact: '0917-111-2222', specialization: 'Isda' },
  { id: 'vendor-002', name: 'Mang Rolly', stall_no: 'B2', contact: '0918-333-4444', specialization: 'Karne' },
  { id: 'vendor-003', name: 'Aling Tess', stall_no: 'C3', contact: '0919-555-6666', specialization: 'Gulay' },
]

export const transactions: Transaction[] = []
export const transactionItems: TransactionItem[] = []
