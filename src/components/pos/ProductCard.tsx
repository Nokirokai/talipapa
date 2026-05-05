import { Plus } from 'lucide-react'
import type { Product } from '../../types'
import { formatPeso, getProductEmoji, stockTone } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const tone = stockTone(product)
  const stockClass =
    tone === 'green' ? 'bg-emerald-300 text-emerald-950' : tone === 'yellow' ? 'bg-amber-300 text-amber-950' : 'bg-red-400 text-white'
  return (
    <Card className="flex min-h-56 flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/10 text-4xl shadow-clay">
          {product.image_url ? <img src={product.image_url} alt="" className="h-full w-full rounded-3xl object-cover" /> : getProductEmoji(product)}
        </div>
        <Badge className={stockClass}>{product.stock_qty} {product.unit}</Badge>
      </div>
      <div className="mt-4 flex-1">
        <h3 className="font-display text-lg font-bold text-talipapa-white">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs font-semibold text-white/55">{product.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-amber-100/60">per {product.unit}</div>
          <div className="font-display text-xl font-extrabold text-amber-200">{formatPeso(product.price)}</div>
        </div>
        <Button className="h-12 w-12 p-0" disabled={!product.is_active || product.stock_qty <= 0} onClick={() => onAdd(product)} aria-label="Magdagdag">
          <Plus size={22} />
        </Button>
      </div>
    </Card>
  )
}
