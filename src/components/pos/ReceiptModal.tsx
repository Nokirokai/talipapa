import { Printer, RotateCcw } from 'lucide-react'
import type { Receipt } from '../../types'
import { formatDate, formatPeso } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface ReceiptModalProps {
  receipt: Receipt | null
  onClose: () => void
  onNew: () => void
  cashierName?: string
}

export function ReceiptModal({ receipt, onClose, onNew, cashierName }: ReceiptModalProps) {
  return (
    <Modal open={Boolean(receipt)} title="Resibo" onClose={onClose} className="max-w-md">
      {receipt ? (
        <div className="receipt bg-white p-5 text-slate-950 print:p-6">
          <div className="text-center">
            <div className="font-display text-2xl font-extrabold">Talipapa POS</div>
            <div className="text-sm font-semibold">Ang inyong tindahan, digitally</div>
            <div className="mt-3 text-xs">Txn: {receipt.transaction.txn_no}</div>
            <div className="text-xs">{formatDate(receipt.transaction.created_at)}</div>
            <div className="text-xs">Cashier: {cashierName ?? 'Demo cashier'}</div>
          </div>
          <div className="my-4 border-t border-dashed border-slate-400" />
          <div className="space-y-2 text-sm">
            {receipt.items.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between gap-3 font-bold">
                  <span>{item.product_name}</span>
                  <span>{formatPeso(item.subtotal)}</span>
                </div>
                <div className="text-xs text-slate-500">{item.qty} {item.unit} x {formatPeso(item.unit_price)}</div>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-dashed border-slate-400" />
          <div className="space-y-1 text-sm font-bold">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPeso(receipt.transaction.subtotal)}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>{formatPeso(receipt.transaction.discount_amount)}</span></div>
            <div className="flex justify-between text-lg"><span>Total</span><span>{formatPeso(receipt.transaction.total)}</span></div>
            <div className="flex justify-between"><span>Payment</span><span className="uppercase">{receipt.transaction.payment_method}</span></div>
            <div className="flex justify-between"><span>Change</span><span>{formatPeso(receipt.transaction.change_amount)}</span></div>
          </div>
          <div className="mt-5 text-center text-xs font-semibold">Salamat po sa pamimili!</div>
          <div className="mt-5 flex gap-2 print:hidden">
            <Button className="flex-1" icon={<Printer size={18} />} onClick={() => window.print()}>I-PRINT</Button>
            <Button className="flex-1" variant="glass" icon={<RotateCcw size={18} />} onClick={onNew}>Bagong Transaksyon</Button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
