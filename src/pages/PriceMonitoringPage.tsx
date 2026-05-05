import { useMemo, useState } from 'react'
import { TrendingUp, AlertCircle, Clock, Check, X } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useCategories } from '../hooks/useCategories'
import { useProducts, useSaveProduct } from '../hooks/useProducts'
import { cn, formatPeso, getProductEmoji } from '../lib/utils'

export function PriceMonitoringPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<number>(0)
  
  const { data: products = [] } = useProducts()
  const { data: categories = [] } = useCategories()
  const saveProduct = useSaveProduct()

  const filtered = useMemo(() => {
    const needle = query.toLowerCase()
    return products.filter((p) => 
      (category === 'all' || p.category_id === category) &&
      (!needle || p.name.toLowerCase().includes(needle) || p.barcode.includes(needle))
    )
  }, [category, products, query])

  const startEditing = (product: any) => {
    setEditingId(product.id)
    setEditPrice(product.price)
  }

  const handleSave = (product: any) => {
    saveProduct.mutate({ ...product, price: editPrice }, {
      onSuccess: () => setEditingId(null)
    })
  }

  return (
    <PageWrapper title="Price Guide" subtitle="Araw-araw na presyo ng mga bilihin" search={query} onSearch={setQuery}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={cn(
              "px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
              category === 'all' ? "bg-amber-400 text-slate-950 shadow-clay" : "bg-white/5 text-white/50 border border-white/5 hover:bg-white/10"
            )}
          >
            Lahat
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border",
                category === c.id ? "text-slate-950 shadow-clay" : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10"
              )}
              style={category === c.id ? { backgroundColor: c.color_hex, borderColor: 'transparent' } : undefined}
            >
              <span className="mr-2">{c.emoji}</span>{c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => {
          const cat = categories.find(c => c.id === product.category_id)
          const lastUpdated = new Date(product.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
          const isEditing = editingId === product.id
          
          return (
            <Card key={product.id} className={cn(
              "p-6 bg-white/5 border-white/10 transition-all group rounded-[32px] overflow-hidden relative",
              isEditing && "ring-2 ring-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.1)]"
            )}>
              <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-[100px] pointer-events-none" />
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-3xl bg-slate-950/50 border border-white/10 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {product.image_url ? <img src={product.image_url} alt="" className="h-full w-full rounded-3xl object-cover" /> : getProductEmoji(product)}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-white tracking-tight uppercase">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase text-amber-200/40 tracking-widest">{cat?.name}</span>
                      <span className="h-1 w-1 rounded-full bg-white/10" />
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{product.unit}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="glass" className="bg-amber-400/10 text-amber-300 border-amber-500/20">{product.barcode.slice(-4)}</Badge>
              </div>

              <div className="space-y-4">
                <div className={cn(
                  "rounded-[28px] p-5 border relative group/price overflow-hidden transition-all",
                  isEditing ? "bg-amber-400 border-transparent" : "bg-black/30 border-white/5"
                )}>
                  {!isEditing && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover/price:opacity-100 transition-opacity" />}
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <div className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-2",
                        isEditing ? "text-slate-900/60" : "text-amber-200/40"
                      )}>
                        <TrendingUp size={12} /> {isEditing ? 'I-type ang Bagong Presyo' : 'Kasalukuyang Presyo'}
                      </div>
                      <div className="flex items-baseline gap-1">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-slate-950">₱</span>
                            <input
                              autoFocus
                              type="number"
                              className="w-24 bg-transparent text-3xl font-black text-slate-950 outline-none border-b-2 border-slate-950/20 focus:border-slate-950 transition-all"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                            />
                          </div>
                        ) : (
                          <>
                            <span className="text-3xl font-black text-white">{formatPeso(product.price)}</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">per {product.unit}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {!isEditing && (
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1 flex items-center justify-end gap-2">
                          <Clock size={10} /> Huling update
                        </div>
                        <div className="text-xs font-bold text-white/60">{lastUpdated}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/5">
                  <AlertCircle size={16} className="text-amber-500/50" />
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wide leading-relaxed">
                    Ang presyo ay maaring magbago base sa bagsakan at panahon.
                  </p>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 h-12 rounded-2xl bg-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <X size={16} /> Kanselahin
                      </button>
                      <button
                        onClick={() => handleSave(product)}
                        className="flex-1 h-12 rounded-2xl bg-teal-400 text-slate-950 text-xs font-black uppercase tracking-widest shadow-clay hover:bg-teal-300 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={16} /> I-save
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(product)}
                        className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        Baguhin ang Presyo
                      </button>
                      <Button className="h-12 px-6 rounded-2xl" variant="glass" onClick={() => window.print()}>
                        <TrendingUp size={18} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </PageWrapper>
  )
}
