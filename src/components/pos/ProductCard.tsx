import { Plus } from 'lucide-react'
import type { Product } from '../../types'
import { formatPeso, getProductEmoji, stockTone, cn } from '../../lib/utils'
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
    <Card className={cn(
      "flex min-h-[180px] md:min-h-56 flex-col p-3 md:p-4 rounded-[20px] md:rounded-[32px]",
      product.stock_qty <= 0 && "opacity-60"
    )}>
      <div className="flex items-start justify-between gap-2 md:gap-3">
        <div className="grid h-12 w-12 md:h-16 md:w-16 place-items-center rounded-2xl md:rounded-3xl bg-white/10 text-2xl md:text-4xl shadow-clay shrink-0">
          {product.image_url ? <img src={product.image_url} alt="" className="h-full w-full rounded-2xl md:rounded-3xl object-cover" /> : getProductEmoji(product)}
        </div>
        <Badge className={cn("text-[8px] md:text-xs", stockClass)}>{product.stock_qty} {product.unit}</Badge>
      </div>
      <div className="mt-3 md:mt-4 flex-1">
        <h3 className="font-display text-sm md:text-lg font-bold text-talipapa-white line-clamp-1">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-[10px] md:text-xs font-semibold text-white/55 leading-tight">{product.description}</p>
      </div>
      <div className="mt-3 md:mt-4 flex items-center justify-between gap-2 md:gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wide text-amber-100/60 truncate">per {product.unit}</div>
          <div className="font-display text-md md:text-xl font-extrabold text-amber-200">{formatPeso(product.price)}</div>
        </div>
        <Button 
          className="h-10 w-10 md:h-12 md:w-12 p-0 rounded-xl md:rounded-2xl shrink-0" 
          disabled={!product.is_active || product.stock_qty <= 0} 
          onClick={() => onAdd(product)} 
          aria-label="Magdagdag"
        >
          <Plus size={20} />
        </Button>
      </div>
    </Card>
  )
}
