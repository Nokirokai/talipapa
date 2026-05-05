import { useEffect, useMemo, useRef, useState } from 'react'
import { ReceiptText, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProductCard } from '../components/pos/ProductCard'
import { CartItem } from '../components/pos/CartItem'
import { PaymentSelector } from '../components/pos/PaymentSelector'
import { ReceiptModal } from '../components/pos/ReceiptModal'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import { useDiscounts, useProcessTransaction } from '../hooks/useTransactions'
import { useCartStore } from '../stores/cartStore'
import { usePosStore } from '../stores/posStore'
import type { Receipt } from '../types'
import { cn, computeCart, formatPeso } from '../lib/utils'

export function POSPage({ cashierId, cashierName }: { cashierId?: string | null; cashierName?: string }) {
  const { data: products = [], isLoading } = useProducts()
  const { data: categories = [] } = useCategories()
  const { data: discounts = [] } = useDiscounts()
  const { activeCategory, searchQuery, setActiveCategory, setSearchQuery } = usePosStore()
  const cart = useCartStore()
  const processTransaction = useProcessTransaction()
  const searchRef = useRef<HTMLInputElement>(null)
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  const selectedDiscount = cart.discount
  const totals = computeCart(cart.items, selectedDiscount)
  const change = cart.paymentMethod === 'cash' ? Math.max(0, cart.amountTendered - totals.total) : 0

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category_id === activeCategory
      const matchesSearch = !query || `${product.name} ${product.description} ${product.barcode}`.toLowerCase().includes(query)
      return product.is_active && matchesCategory && matchesSearch
    })
  }, [activeCategory, products, searchQuery])

  const handleProcess = async () => {
    if (!cart.items.length) {
      toast.error('Walang laman ang cart')
      return
    }
    if (cart.paymentMethod === 'cash' && cart.amountTendered < totals.total) {
      toast.error('Kulang ang bayad')
      return
    }
    const result = await processTransaction.mutateAsync({
      items: cart.items,
      discount: selectedDiscount,
      paymentMethod: cart.paymentMethod,
      amountTendered: cart.paymentMethod === 'cash' ? cart.amountTendered : totals.total,
      cashierId,
    })
    setReceipt(result)
    cart.clearCart()
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'F9') {
        event.preventDefault()
        handleProcess()
      }
      if (event.key === 'Escape') setReceipt(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="grid min-h-screen flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)] print:block">
      <section className="min-h-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl print:hidden">
        <div className="border-b border-white/10 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-talipapa-white">Talipapa POS</h1>
              <p className="text-sm font-semibold text-amber-100/65">Sariwang paninda, mabilis na bayad</p>
            </div>
            <Input
              ref={searchRef}
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="F2 Hanapin produkto o barcode"
              className="md:w-80"
            />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'shrink-0 rounded-2xl px-4 py-2 text-sm font-extrabold shadow-clay transition active:shadow-clay-pressed',
                activeCategory === 'all' ? 'bg-amber-300 text-slate-950' : 'bg-white/10 text-white/70',
              )}
            >
              Lahat
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'shrink-0 rounded-2xl px-4 py-2 text-sm font-extrabold shadow-clay transition active:shadow-clay-pressed',
                  activeCategory === category.id ? 'text-slate-950' : 'bg-white/10 text-white/70',
                )}
                style={activeCategory === category.id ? { backgroundColor: category.color_hex } : undefined}
              >
                <span className="mr-1">{category.emoji}</span>{category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[calc(100vh-164px)] overflow-auto p-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-56" />)}
            </div>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={cart.addItem} />)}
            </div>
          ) : (
            <div className="grid h-full place-items-center text-center text-white/70">
              <div>
                <svg viewBox="0 0 160 120" className="mx-auto h-28 w-36">
                  <path d="M26 70c28-34 65-34 108 0-43 31-80 31-108 0Z" fill="#0D9488" opacity=".9" />
                  <circle cx="116" cy="69" r="5" fill="#FFF8F0" />
                  <path d="M26 70 8 55v31z" fill="#FBBF24" />
                </svg>
                <div className="font-display text-xl font-bold">Walang nahanap</div>
                <div className="text-sm">Subukan ang ibang category o search.</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <aside className="flex min-h-0 flex-col rounded-3xl border border-white/15 bg-white/10 shadow-glass backdrop-blur-xl print:hidden">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h2 className="font-display text-xl font-extrabold text-talipapa-white">Cart / Checkout</h2>
            <p className="text-xs font-semibold text-white/50">F9 para i-proseso</p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-300 text-slate-950 shadow-clay">
            <ReceiptText size={22} />
          </div>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-auto p-4">
          {cart.items.length ? cart.items.map((item) => (
            <CartItem key={item.product.id} item={item} onQty={(qty) => cart.setQty(item.product.id, qty)} onRemove={() => cart.removeItem(item.product.id)} />
          )) : (
            <Card className="p-6 text-center text-white/60">
              <svg viewBox="0 0 160 120" className="mx-auto h-24 w-32">
                <path d="M22 30h116l-10 58H34z" fill="#F59E0B" opacity=".8" />
                <path d="M48 88a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm58 0a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" fill="#0D9488" />
                <path d="M50 42h26v28H50zm36 0h26v28H86z" fill="#FFF8F0" opacity=".85" />
              </svg>
              <div className="font-display text-lg font-bold text-talipapa-white">Wala pang item</div>
              <div className="text-sm">Magdagdag mula sa product grid.</div>
            </Card>
          )}
        </div>
        <div className="space-y-4 border-t border-white/10 p-4">
          <select
            className="h-12 w-full rounded-2xl border border-white/15 bg-slate-950/40 px-4 text-sm font-bold text-talipapa-white outline-none"
            value={selectedDiscount?.id ?? ''}
            onChange={(event) => cart.setDiscount(discounts.find((discount) => discount.id === event.target.value) ?? null)}
          >
            <option value="">Walang discount</option>
            {discounts.filter((discount) => discount.value > 0).map((discount) => <option key={discount.id} value={discount.id}>{discount.name}</option>)}
          </select>
          <PaymentSelector value={cart.paymentMethod} onChange={cart.setPaymentMethod} />
          {cart.paymentMethod === 'cash' ? (
            <Input
              type="number"
              min="0"
              value={cart.amountTendered || ''}
              onChange={(event) => cart.setAmountTendered(Number(event.target.value))}
              placeholder="Halagang natanggap"
            />
          ) : null}
          <div className="space-y-2 rounded-2xl bg-slate-950/30 p-4">
            <div className="flex justify-between text-sm font-bold text-white/65"><span>Subtotal</span><span>{formatPeso(totals.subtotal)}</span></div>
            <div className="flex justify-between text-sm font-bold text-white/65"><span>Discount</span><span>{formatPeso(totals.discountAmount)}</span></div>
            <div className="flex justify-between font-display text-3xl font-extrabold text-amber-200"><span>TOTAL</span><span>{formatPeso(totals.total)}</span></div>
            <div className="flex justify-between text-sm font-bold text-teal-200"><span>Sukli</span><span>{formatPeso(change)}</span></div>
          </div>
          <Button className="h-14 w-full text-base" disabled={processTransaction.isPending} onClick={handleProcess}>
            {processTransaction.isPending ? 'Pinoproseso...' : 'I-PROSESO'}
          </Button>
        </div>
      </aside>

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} cashierName={cashierName} onNew={() => setReceipt(null)} />
    </div>
  )
}
