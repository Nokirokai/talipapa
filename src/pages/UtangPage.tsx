import { useMemo, useState } from 'react'
import { User, Wallet, CheckCircle2, Plus, Save, Package, Trash2, Clock } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { useTransactions, useTransactionItems, useProcessTransaction } from '../hooks/useTransactions'
import { useProducts } from '../hooks/useProducts'
import { formatPeso, cn, getProductEmoji, stockTone } from '../lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, hasSupabaseConfig } from '../lib/supabase'
import { localDb } from '../lib/localDb'
import toast from 'react-hot-toast'
import type { Product, CartItem } from '../types'

const fieldClass = 'h-12 w-full rounded-2xl bg-white/5 px-4 text-sm font-bold text-white outline-none placeholder:text-white/20 focus:ring-2 focus:ring-amber-400/30 border border-white/10 transition-all focus:bg-white/10'
const labelClass = 'block text-[11px] font-black uppercase tracking-[0.2em] text-amber-200/40 mb-2 ml-1'

export function UtangPage() {
  const [query, setQuery] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid'>('unpaid')
  const [customerName, setCustomerName] = useState('')
  const [customerDetails, setCustomerDetails] = useState('')
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([])
  
  const { data: transactions = [] } = useTransactions()
  const { data: transactionItems = [] } = useTransactionItems()
  const { data: products = [] } = useProducts()
  const processTransaction = useProcessTransaction()
  const queryClient = useQueryClient()

  const utangs = useMemo(() => {
    return transactions
      .filter(t => t.payment_method === 'utang' && t.payment_status === activeTab)
      .filter(t => {
        const needle = query.toLowerCase()
        return !needle || (t.notes?.toLowerCase() || '').includes(needle)
      })
  }, [transactions, query, activeTab])

  const totalOutstanding = useMemo(() => {
    return transactions
      .filter(t => t.payment_method === 'utang' && t.payment_status === 'unpaid')
      .reduce((sum, t) => sum + t.total, 0)
  }, [transactions])

  const settleMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const target = transactions.find(t => t.id === transactionId)
      if (!target) return

      if (!hasSupabaseConfig || !supabase) {
        await localDb.upsertTransaction({ ...target, payment_status: 'paid' })
        return
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .update({ payment_status: 'paid' })
        .eq('id', transactionId)
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Bayad na ang utang!')
    },
    onError: () => toast.error('Hindi ma-update ang status')
  })

  const handleAddManualUtang = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName) return toast.error('Ilagay ang pangalan')
    if (selectedItems.length === 0) return toast.error('Magdagdag ng produkto')

    const total = selectedItems.reduce((sum, i) => sum + i.product.price * i.qty, 0)

    try {
      await processTransaction.mutateAsync({
        items: selectedItems,
        paymentMethod: 'utang',
        amountTendered: total,
        notes: `${customerName} | ${customerDetails}`,
      })
      
      setIsAdding(false)
      setCustomerName('')
      setCustomerDetails('')
      setSelectedItems([])
    } catch (err) {
      // toast handled in mutation
    }
  }

  const toggleProduct = (product: Product) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.filter(i => i.product.id !== product.id)
      return [...prev, { product, qty: 1 }]
    })
  }

  const updateQty = (productId: string, delta: number) => {
    setSelectedItems(prev => prev.map(i => 
      i.product.id === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ))
  }

  const manualTotal = selectedItems.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  return (
    <PageWrapper title="Registry ng Utang" subtitle="Pangasiwaan ang mga pautang ng tindahan" search={query} onSearch={setQuery}>
      <div className="relative mb-8 overflow-hidden rounded-[40px] border border-white/20 bg-gradient-to-br from-[#451a03] to-[#7c2d12] p-10 shadow-glass">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-[32px] bg-white/10 text-amber-300 backdrop-blur-xl border border-white/10 shadow-inner">
              <Wallet size={40} />
            </div>
            <div>
              <h2 className="font-display text-4xl font-black text-white uppercase tracking-tight leading-none mb-2">Utang Registry</h2>
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200/50 mb-0.5">Total Balance</span>
                  <span className="text-2xl font-black text-white leading-none">{formatPeso(totalOutstanding)}</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200/50 mb-0.5">Active Debts</span>
                  <span className="text-2xl font-black text-white leading-none">
                    {transactions.filter(t => t.payment_method === 'utang' && t.payment_status === 'unpaid').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="clay"
            className="h-16 px-12 rounded-[28px] active:scale-95 transition-all text-slate-950 font-black shadow-clay bg-amber-400 hover:bg-amber-300 text-lg"
            icon={<Plus size={28} />} 
            onClick={() => setIsAdding(true)}
          >
            Magdagdag ng Utang
          </Button>
        </div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-500/20 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-rose-500/10 blur-[100px]" />
      </div>

      <div className="flex gap-2 mb-6 p-1.5 bg-white/5 rounded-[24px] w-fit border border-white/10">
        <button 
          onClick={() => setActiveTab('unpaid')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
            activeTab === 'unpaid' ? "bg-amber-400 text-slate-950 shadow-clay" : "text-white/40 hover:text-white"
          )}
        >
          <Clock size={18} />
          Hindi pa Bayad
        </button>
        <button 
          onClick={() => setActiveTab('paid')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
            activeTab === 'paid' ? "bg-emerald-400 text-slate-950 shadow-clay" : "text-white/40 hover:text-white"
          )}
        >
          <CheckCircle2 size={18} />
          Bayad Na
        </button>
      </div>

      <div className="space-y-4 pb-32">
        {utangs.length > 0 ? utangs.map((utang) => {
          const [name, details] = (utang.notes || '').split('|').map(s => s.trim())
          const items = transactionItems.filter(i => i.transaction_id === utang.id)
          const isPaid = utang.payment_status === 'paid'
          
          return (
            <Card key={utang.id} className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all group overflow-hidden relative rounded-[32px]">
              <div className={cn(
                "absolute left-0 top-0 h-full w-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
                isPaid ? "bg-emerald-500" : "bg-amber-500"
              )} />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6 flex-1">
                  <div className={cn(
                    "h-16 w-16 rounded-[24px] border flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform",
                    isPaid ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                  )}>
                    <User size={32} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-display text-2xl font-black text-white tracking-tight">{name || 'Walang Pangalan'}</h3>
                      <Badge variant="outline" className={isPaid ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"}>
                        {utang.txn_no}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-[0.15em] flex items-center gap-2">
                      <span className={cn("h-1.5 w-1.5 rounded-full", isPaid ? "bg-emerald-500" : "bg-amber-500")} />
                      {details || 'Walang karagdagang detalye'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-10 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">{isPaid ? 'Halagang Nabayaran' : 'Dapat Bayaran'}</div>
                    <div className={cn("text-3xl font-black", isPaid ? "text-emerald-400" : "text-amber-200")}>{formatPeso(utang.total)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    {!isPaid ? (
                      <Button 
                        variant="clay" 
                        className="h-14 px-8 rounded-2xl active:scale-95 transition-all text-slate-950 font-black shadow-clay bg-teal-400 hover:bg-teal-300"
                        icon={<CheckCircle2 size={24} />}
                        onClick={() => settleMutation.mutate(utang.id)}
                        disabled={settleMutation.isPending}
                      >
                        Bayad na
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-widest text-xs">
                        <CheckCircle2 size={20} />
                        Bayad Na
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 group-hover:block hidden animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-wrap gap-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-2 text-xs font-black text-white/60 border border-white/5 shadow-sm">
                      <span className="text-amber-400">{item.qty}x</span>
                      <span>{item.product_name}</span>
                      <span className="text-white/20 ml-1">{formatPeso(item.unit_price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
        }) : (
          <div className="flex flex-col items-center justify-center py-40 opacity-10">
            <Wallet size={80} className="mb-8" />
            <p className="font-display text-3xl font-black uppercase tracking-[0.3em]">
              {activeTab === 'unpaid' ? 'Walang Utang' : 'Walang Bayad Na'}
            </p>
          </div>
        )}
      </div>

      <Modal open={isAdding} title="Bagong Pautang" onClose={() => setIsAdding(false)} className="max-w-5xl bg-[#2a1001]/95 border-white/10 backdrop-blur-3xl p-0">
        <form onSubmit={handleAddManualUtang} className="space-y-8 p-8 overflow-hidden relative">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-1">
              <label className={labelClass}>Pangalan ng Tao</label>
              <input className={fieldClass} placeholder="Juan Dela Cruz" value={customerName} onChange={e => setCustomerName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Mga Detalye (Petsa o Dahilan)</label>
              <input className={fieldClass} placeholder="Hal. Babayaran sa Lunes" value={customerDetails} onChange={e => setCustomerDetails(e.target.value)} />
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <label className="text-xs font-black uppercase tracking-[0.2em] text-white">Pumili ng mga Paninda</label>
                <p className="text-[10px] font-bold text-amber-200/30 uppercase mt-1">I-click ang mga item para idagdag</p>
              </div>
              <Badge variant="outline" className="bg-white/5">{products.length} Items</Badge>
            </div>
            
            <div className="h-72 overflow-y-auto pr-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pb-4 custom-scrollbar">
              {products.map(product => {
                const isSelected = selectedItems.some(i => i.product.id === product.id)
                const tone = stockTone(product)
                const stockClass = tone === 'green' ? 'bg-emerald-300 text-emerald-950' : tone === 'yellow' ? 'bg-amber-300 text-amber-950' : 'bg-red-400 text-white'
                
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product)}
                    className={cn(
                      "flex flex-col p-4 rounded-[24px] border transition-all text-left relative overflow-hidden group/card min-h-[160px]",
                      isSelected 
                        ? "bg-amber-500/20 border-amber-500/50 ring-2 ring-amber-500/20 scale-[0.98] shadow-inner" 
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl shadow-clay shrink-0">
                        {product.image_url ? <img src={product.image_url} alt="" className="h-full w-full rounded-2xl object-cover" /> : getProductEmoji(product)}
                      </div>
                      <Badge className={cn("text-[8px] px-1 py-0.5", stockClass)}>{product.stock_qty}</Badge>
                    </div>

                    <div className="flex-1 mb-2">
                      <h3 className="font-display text-[13px] font-black text-white truncate uppercase tracking-tight">{product.name}</h3>
                    </div>

                    <div className="font-display text-md font-black text-amber-200">{formatPeso(product.price)}</div>
                    {isSelected && <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none" />}
                  </button>
                )
              })}
            </div>
          </div>

          {selectedItems.length > 0 && (
            <div className="p-8 bg-black/40 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="absolute left-0 top-0 h-full w-2 bg-amber-500/40" />
              <div className="text-[10px] font-black uppercase text-amber-200/40 tracking-[0.3em] mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-amber-200/10" />
                Selected Items Summary
                <div className="h-px flex-1 bg-amber-200/10" />
              </div>
              <div className="space-y-4 max-h-48 overflow-y-auto pr-4 custom-scrollbar">
                {selectedItems.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between gap-6 group/row">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <Package size={18} className="text-white/30" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black text-white truncate uppercase">{item.product.name}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{formatPeso(item.product.price)} / {item.product.unit}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10">
                        <button type="button" onClick={() => updateQty(item.product.id, -1)} className="h-9 w-9 flex items-center justify-center font-black hover:text-amber-400 transition-colors">-</button>
                        <span className="w-12 text-center text-sm font-black text-amber-100">{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item.product.id, 1)} className="h-9 w-9 flex items-center justify-center font-black hover:text-amber-400 transition-colors">+</button>
                      </div>
                      <div className="w-28 text-right text-lg font-black text-amber-200 tracking-tight">{formatPeso(item.product.price * item.qty)}</div>
                      <button type="button" onClick={() => toggleProduct(item.product)} className="text-rose-500/40 hover:text-rose-400 transition-all hover:scale-110"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Total Amount to Credit</span>
                  <div className="text-sm font-bold text-amber-200/50 mt-1">{selectedItems.length} items total</div>
                </div>
                <span className="text-4xl font-black text-amber-200 tracking-tighter">{formatPeso(manualTotal)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 relative z-10">
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="px-10 h-14 rounded-[20px] text-white/40 hover:text-white uppercase tracking-widest text-xs">Kanselahin</Button>
            <Button type="submit" variant="clay" className="px-14 h-16 rounded-[28px] active:scale-95 transition-all text-slate-950 font-black shadow-clay bg-amber-400 text-lg uppercase tracking-tight" icon={<Save size={28} />} disabled={processTransaction.isPending || selectedItems.length === 0}>I-save ang Utang</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  )
}
