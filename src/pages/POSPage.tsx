import { useEffect, useMemo, useRef, useState } from 'react'
import { ReceiptText, Search, TrendingUp, Wallet, Coins, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProductCard } from '../components/pos/ProductCard'
import { CartItem } from '../components/pos/CartItem'
import { PaymentSelector } from '../components/pos/PaymentSelector'
import { ReceiptModal } from '../components/pos/ReceiptModal'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Skeleton } from '../components/ui/Skeleton'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import { useProcessTransaction } from '../hooks/useTransactions'
import { useDailyPulse } from '../hooks/useReports'
import { useCartStore } from '../stores/cartStore'
import { usePosStore } from '../stores/posStore'
import type { Receipt } from '../types'
import { cn, computeCart, formatPeso } from '../lib/utils'

export function POSPage({ cashierId, cashierName }: { cashierId?: string | null; cashierName?: string }) {
  const { data: products = [], isLoading } = useProducts()
  const { data: categories = [] } = useCategories()
  const { activeCategory, searchQuery, setActiveCategory, setSearchQuery } = usePosStore()
  const cart = useCartStore()
  const processTransaction = useProcessTransaction()
  const pulse = useDailyPulse()
  const searchRef = useRef<HTMLInputElement>(null)
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  const totals = computeCart(cart.items, null)
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
      discount: null,
      paymentMethod: cart.paymentMethod,
      amountTendered: cart.paymentMethod === 'cash' ? cart.amountTendered : totals.total,
      cashierId,
      notes: cart.paymentMethod === 'utang' ? `${cart.customerName} | ${cart.customerDetails}` : null,
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
  }, [])

  return (
    <div className="grid min-h-screen flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)] print:block">
      <section className="min-h-0 overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/10 bg-white/5 shadow-glass backdrop-blur-xl print:hidden">
        <div className="border-b border-white/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-black text-talipapa-white tracking-tight">Tindahan POS</h1>
              <p className="text-sm font-bold text-amber-200/50 uppercase tracking-widest">Sariwang paninda araw-araw</p>
            </div>
            <Input
              ref={searchRef}
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="F2 Hanapin produkto..."
              className="md:w-96 h-12"
            />
          </div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'shrink-0 rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all active:scale-95',
                activeCategory === 'all' ? 'bg-amber-400 text-slate-950 shadow-clay' : 'bg-white/5 text-white/50 border border-white/5'
              )}
            >
              Lahat
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'shrink-0 rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all active:scale-95 border',
                  activeCategory === category.id ? 'text-slate-950 shadow-clay' : 'bg-white/5 text-white/50 border-white/5'
                )}
                style={activeCategory === category.id ? { backgroundColor: category.color_hex, borderColor: 'transparent' } : undefined}
              >
                <span className="mr-2">{category.emoji}</span>{category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[calc(100vh-188px)] overflow-auto p-3 md:p-6 custom-scrollbar">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-48 md:h-60 rounded-[24px] md:rounded-[32px]" />)}
            </div>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={cart.addItem} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-10">
              <Search size={80} className="mb-4" />
              <p className="font-display text-2xl font-black uppercase tracking-[0.2em]">Walang Nahanap</p>
            </div>
          )}
        </div>
      </section>

      <aside className="flex min-h-0 flex-col rounded-[24px] md:rounded-[32px] border border-white/15 bg-white/10 shadow-glass backdrop-blur-xl print:hidden overflow-hidden pb-32 md:pb-0">
        {/* Today's Quick Pulse Section */}
        <div className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200/50">
              <TrendingUp size={12} /> Today's Pulse
            </div>
            <div className="text-[10px] font-bold text-white/20 uppercase">{pulse.count} txns</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-2xl p-3 border border-white/5">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase text-teal-400 mb-1"><Coins size={10} /> Cash</div>
              <div className="text-sm font-black text-white">{formatPeso(pulse.cash)}</div>
            </div>
            <div className="bg-black/20 rounded-2xl p-3 border border-white/5">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase text-amber-400 mb-1"><Wallet size={10} /> Utang</div>
              <div className="text-sm font-black text-white">{formatPeso(pulse.utang)}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6">
          <div>
            <h2 className="font-display text-2xl font-black text-talipapa-white uppercase tracking-tight">Kasalukuyang Cart</h2>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">F9 I-Proseso ang Bayad</p>
          </div>
          <div className="h-12 w-12 grid place-items-center rounded-2xl bg-amber-400 text-slate-950 shadow-clay">
            <ReceiptText size={24} />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-auto p-6 custom-scrollbar">
          {cart.items.length ? cart.items.map((item) => (
            <CartItem key={item.product.id} item={item} onQty={(qty) => cart.setQty(item.product.id, qty)} onRemove={() => cart.removeItem(item.product.id)} />
          )) : (
            <div className="flex flex-col items-center justify-center h-full opacity-10 py-10">
              <ShoppingCart size={48} className="mb-4" />
              <p className="text-xs font-black uppercase tracking-widest text-center">Walang laman ang cart</p>
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-white/10 p-6 bg-slate-950/20 backdrop-blur-md">
          {cart.paymentMethod === 'utang' && (
            <div className="space-y-3 rounded-3xl bg-amber-500/10 p-4 border border-amber-500/20 animate-in fade-in slide-in-from-top-4">
              <div className="text-[10px] font-black text-amber-200 uppercase tracking-[0.2em] mb-1">Impormasyon sa Utang</div>
              <Input
                placeholder="Pangalan ng tao"
                value={cart.customerName}
                onChange={(e) => cart.setCustomerName(e.target.value)}
                className="h-10 bg-black/40"
              />
              <textarea
                className="w-full rounded-2xl bg-black/40 p-3 text-xs font-bold text-white outline-none placeholder:text-white/20 focus:ring-2 focus:ring-amber-300/30 border border-white/5"
                placeholder="Mga detalye (Hal. Kailan babayaran)"
                rows={2}
                value={cart.customerDetails}
                onChange={(e) => cart.setCustomerDetails(e.target.value)}
              />
            </div>
          )}
          
          <PaymentSelector value={cart.paymentMethod} onChange={cart.setPaymentMethod} />
          
          {cart.paymentMethod === 'cash' && (
            <Input
              type="number"
              min="0"
              value={cart.amountTendered || ''}
              onChange={(event) => cart.setAmountTendered(Number(event.target.value))}
              placeholder="Halagang natanggap (Cash)"
              className="h-12 text-lg"
            />
          )}

          <div className="space-y-2 md:space-y-3 rounded-2xl md:rounded-3xl bg-slate-950/40 p-4 md:p-6 border border-white/5">
            <div className="flex justify-between text-[11px] font-black uppercase text-white/30 tracking-widest">
              <span>Subtotal</span>
              <span>{formatPeso(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between font-display text-4xl font-black text-amber-200 tracking-tighter">
              <span>TOTAL</span>
              <span>{formatPeso(totals.total)}</span>
            </div>
            {cart.paymentMethod === 'cash' && (
              <div className="flex justify-between text-xs font-black text-teal-400 uppercase tracking-widest pt-2 border-t border-white/5">
                <span>Sukli</span>
                <span>{formatPeso(change)}</span>
              </div>
            )}
          </div>

          <Button className="h-16 w-full text-lg rounded-3xl uppercase tracking-widest font-black" disabled={processTransaction.isPending || cart.items.length === 0} onClick={handleProcess}>
            {processTransaction.isPending ? 'Pinoproseso...' : 'TAPUSIN ANG BAYAD'}
          </Button>
        </div>
      </aside>

      <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} cashierName={cashierName} onNew={() => setReceipt(null)} />
    </div>
  )
}
