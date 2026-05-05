import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../../types'
import { formatPeso, getProductEmoji } from '../../lib/utils'

interface CartItemProps {
  item: CartItemType
  onQty: (qty: number) => void
  onRemove: () => void
}

export function CartItem({ item, onQty, onRemove }: CartItemProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-2xl shadow-clay">
          {getProductEmoji(item.product)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-extrabold text-talipapa-white">{item.product.name}</div>
          <div className="text-xs font-semibold text-white/50">{formatPeso(item.product.price)} / {item.product.unit}</div>
        </div>
        <button onClick={onRemove} className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-red-400/90 text-white shadow-clay">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center rounded-2xl bg-white/10 p-1 shadow-clay">
          <button onClick={() => onQty(item.qty - 1)} className="grid h-8 w-8 place-items-center rounded-xl bg-amber-200 text-slate-950">
            <Minus size={16} />
          </button>
          <span className="w-12 text-center text-sm font-extrabold text-white">{item.qty}</span>
          <button onClick={() => onQty(item.qty + 1)} className="grid h-8 w-8 place-items-center rounded-xl bg-amber-200 text-slate-950">
            <Plus size={16} />
          </button>
        </div>
        <div className="font-display text-lg font-extrabold text-amber-100">{formatPeso(item.product.price * item.qty)}</div>
      </div>
    </div>
  )
}
