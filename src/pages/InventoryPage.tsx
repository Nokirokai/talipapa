import { Download, Minus, Plus } from 'lucide-react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAdjustStock, useProducts } from '../hooks/useProducts'
import { cn, downloadCsv, stockTone } from '../lib/utils'

export function InventoryPage() {
  const { data: products = [] } = useProducts()
  const adjustStock = useAdjustStock()

  return (
    <PageWrapper title="Inventory" subtitle="Stock levels at adjustments">
      <div className="mb-4 flex justify-end">
        <Button
          icon={<Download size={18} />}
          onClick={() => downloadCsv('talipapa-inventory.csv', products.map((product) => ({
            name: product.name,
            unit: product.unit,
            price: product.price,
            stock_qty: product.stock_qty,
            low_stock_threshold: product.low_stock_threshold,
            barcode: product.barcode,
          })))}
        >
          Export CSV
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const tone = stockTone(product)
          const pct = Math.min(100, (product.stock_qty / Math.max(product.low_stock_threshold * 4, 1)) * 100)
          return (
            <Card key={product.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-talipapa-white">{product.name}</h3>
                  <p className="text-sm font-semibold text-white/50">{product.stock_qty} {product.unit} available</p>
                </div>
                <span className={cn('rounded-full px-3 py-1 text-xs font-extrabold shadow-clay', tone === 'green' ? 'bg-emerald-300 text-emerald-950' : tone === 'yellow' ? 'bg-amber-300 text-amber-950' : 'bg-red-400 text-white')}>
                  {tone === 'green' ? 'OK' : tone === 'yellow' ? 'Low' : 'Out'}
                </span>
              </div>
              <div className="mt-4 h-3 rounded-full bg-white/10">
                <div className={cn('h-3 rounded-full', tone === 'green' ? 'bg-emerald-300' : tone === 'yellow' ? 'bg-amber-300' : 'bg-red-400')} style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
                <input id={`reason-${product.id}`} className="min-w-0 rounded-2xl bg-slate-950/35 px-3 py-2 text-sm font-bold text-white" placeholder="Reason" />
                <Button className="h-10 w-10 p-0" variant="glass" onClick={() => adjustStock.mutate({ product, delta: -1, reason: 'manual' })}><Minus size={16} /></Button>
                <Button className="h-10 w-10 p-0" onClick={() => adjustStock.mutate({ product, delta: 1, reason: 'manual' })}><Plus size={16} /></Button>
              </div>
            </Card>
          )
        })}
      </div>
    </PageWrapper>
  )
}
