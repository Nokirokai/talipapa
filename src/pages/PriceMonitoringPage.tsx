import { useMemo, useState } from 'react'
import { Package, Plus, Save, Search } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { useCategories } from '../hooks/useCategories'
import { useProducts, useSaveProduct } from '../hooks/useProducts'
import { cn, getProductEmoji, stockTone } from '../lib/utils'
import type { Product, Unit } from '../types'

const units: Unit[] = ['kg', 'pc', 'bundle', 'tali', 'dozen', 'liter']
const fieldClass = 'h-11 w-full rounded-2xl bg-slate-950/40 px-3 text-sm font-bold text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-amber-300/30'
const labelClass = 'space-y-1.5 text-xs font-extrabold uppercase text-amber-100/60'

const emptyProduct = (): Product => ({
  id: crypto.randomUUID(),
  category_id: '',
  name: '',
  description: '',
  unit: 'pc',
  price: 0,
  stock_qty: 0,
  low_stock_threshold: 5,
  image_url: null,
  barcode: `899${Math.floor(Math.random() * 100000000)}`,
  is_active: true,
  created_at: new Date().toISOString(),
})

function PriceInput({ value, onSave }: { value: number; onSave: (val: number) => void }) {
  const [local, setLocal] = useState(value.toString())
  
  return (
    <div className="relative group/input">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-amber-300/40 group-focus-within/input:text-amber-300 transition-colors">₱</span>
      <input
        type="number"
        className="h-11 w-full rounded-xl bg-slate-950/60 pl-7 pr-3 text-lg font-black text-amber-200 outline-none transition-all focus:ring-2 focus:ring-amber-300/50"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          const num = Number(local)
          if (!isNaN(num) && num !== value) onSave(num)
        }}
      />
    </div>
  )
}

export function PriceMonitoringPage() {
  const [query, setQuery] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newProduct, setNewProduct] = useState<Product | null>(null)
  const { data: products = [] } = useProducts()
  const { data: categories = [] } = useCategories()
  const saveProduct = useSaveProduct()

  const filtered = useMemo(() => {
    const needle = query.toLowerCase()
    return products.filter((product) =>
      !needle || 
      `${product.name} ${product.barcode}`.toLowerCase().includes(needle) ||
      product.price.toString().includes(needle)
    )
  }, [products, query])

  const handlePriceChange = (product: Product, newPrice: number) => {
    saveProduct.mutate({ ...product, price: newPrice })
  }

  return (
    <PageWrapper title="Price Guide" subtitle="Mabilisang paghahanap at pag-update ng presyo" search={query} onSearch={setQuery}>
      <div className="relative mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#451a03] to-[#7c2d12] p-8 shadow-glass">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/10 text-amber-300 backdrop-blur-md border border-white/10 shadow-inner">
              <Package size={32} />
            </div>
            <div>
              <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight leading-none mb-1">Index ng Paninda</h2>
              <p className="text-xs font-bold text-amber-100/60 uppercase tracking-widest">{filtered.length} Paninda sa Listahan</p>
            </div>
          </div>
          
          <Button 
            variant="clay"
            className="h-14 px-10 rounded-[24px] active:scale-95 transition-all text-slate-950 font-black shadow-clay"
            icon={<Plus size={24} />} 
            onClick={() => {
              setNewProduct({ ...emptyProduct(), category_id: categories[0]?.id ?? '' })
              setIsAdding(true)
            }}
          >
            Bagong Paninda
          </Button>
        </div>
        
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-24">
        {filtered.map((product) => {
          const tone = stockTone(product)
          const stockClass = tone === 'green' ? 'bg-emerald-300 text-emerald-950' : tone === 'yellow' ? 'bg-amber-300 text-amber-950' : 'bg-red-400 text-white'
          
          return (
            <Card key={product.id} className="flex flex-col p-4 group hover:bg-white/5 transition-all border-white/10 overflow-hidden relative">
              <div className="absolute left-0 top-0 h-1 w-full bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-3xl shadow-clay shrink-0">
                  {product.image_url ? <img src={product.image_url} alt="" className="h-full w-full rounded-2xl object-cover" /> : getProductEmoji(product)}
                </div>
                <Badge className={cn("text-[10px] px-1.5 py-0.5", stockClass)}>{product.stock_qty} {product.unit}</Badge>
              </div>

              <div className="flex-1 mb-4">
                <h3 className="font-display text-base font-black text-talipapa-white truncate">{product.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-tighter truncate">
                    {categories.find(c => c.id === product.category_id)?.name}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/10 shrink-0" />
                  <span className="text-[9px] font-bold text-white/30 truncate">{product.barcode}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5">
                <div className="text-[9px] font-black uppercase text-amber-100/40 mb-1 tracking-widest">Update Price</div>
                <PriceInput 
                  value={product.price} 
                  onSave={(newPrice) => handlePriceChange(product, newPrice)} 
                />
                <div className="mt-1 text-[9px] font-bold text-white/20 uppercase">per {product.unit}</div>
              </div>
            </Card>
          )
        })}
        
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-32 opacity-10">
            <Search size={64} className="mb-6" />
            <p className="font-display text-2xl font-black uppercase tracking-[0.2em]">Walang Nahanap</p>
          </div>
        )}
      </div>

      <Modal open={isAdding} title="Bagong Paninda" onClose={() => setIsAdding(false)} className="max-w-xl">
        {newProduct ? (
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              saveProduct.mutate(newProduct, { onSuccess: () => setIsAdding(false) })
            }}
          >
            <div className="md:col-span-2">
              <label className={labelClass}>Pangalan ng Paninda</label>
              <input className={fieldClass} placeholder="Hal. Bangus, Kangkong, etc." value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} required />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={fieldClass} value={newProduct.category_id} onChange={(event) => setNewProduct({ ...newProduct, category_id: event.target.value })} required>
                <option value="" disabled>Pumili ng category</option>
                {categories.map((row) => <option key={row.id} value={row.id}>{row.emoji} {row.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <select className={fieldClass} value={newProduct.unit} onChange={(event) => setNewProduct({ ...newProduct, unit: event.target.value as Unit })}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select>
            </div>
            <div>
              <label className={labelClass}>Presyo (₱)</label>
              <input type="number" className={fieldClass} placeholder="0.00" value={newProduct.price} onChange={(event) => setNewProduct({ ...newProduct, price: Number(event.target.value) })} />
            </div>
            <div>
              <label className={labelClass}>Stock (Optional)</label>
              <input type="number" className={fieldClass} placeholder="0" value={newProduct.stock_qty} onChange={(event) => setNewProduct({ ...newProduct, stock_qty: Number(event.target.value) })} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Barcode / SKU</label>
              <input className={fieldClass} placeholder="Scan or enter barcode..." value={newProduct.barcode} onChange={(event) => setNewProduct({ ...newProduct, barcode: event.target.value })} />
            </div>
            <div className="flex justify-end gap-3 md:col-span-2 pt-6 border-t border-white/10 mt-2">
              <Button type="button" variant="glass" onClick={() => setIsAdding(false)} className="px-6 rounded-2xl">Kanselahin</Button>
              <Button type="submit" variant="clay" className="px-8 rounded-2xl" icon={<Save size={18} />}>I-save</Button>
            </div>
          </form>
        ) : null}
      </Modal>
    </PageWrapper>
  )
}
