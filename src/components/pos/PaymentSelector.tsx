import type { ReactNode } from 'react'
import type { PaymentMethod } from '../../types'
import { cn } from '../../lib/utils'

function CashIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
      <rect x="4" y="8" width="24" height="16" rx="4" fill="currentColor" opacity="0.22" />
      <path d="M8 12h16v8H8z" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <path d="M10 14h2m8 4h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LedgerIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
      <rect x="8" y="5" width="16" height="22" rx="3" fill="currentColor" opacity="0.22" />
      <path d="M12 10h8m-8 5h8m-8 5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 5v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

const methods: Array<{ value: PaymentMethod; label: string; icon: ReactNode; className: string }> = [
  { value: 'cash', label: 'Cash', icon: <CashIcon />, className: 'bg-amber-300 text-slate-950' },
  { value: 'utang', label: 'Utang', icon: <LedgerIcon />, className: 'bg-rose-300 text-slate-950' },
]

export function PaymentSelector({ value, onChange }: { value: PaymentMethod; onChange: (value: PaymentMethod) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {methods.map((method) => (
        <button
          key={method.value}
          onClick={() => onChange(method.value)}
          className={cn(
            'flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-extrabold shadow-clay transition-all active:shadow-clay-pressed',
            value === method.value ? method.className : 'bg-white/10 text-white/70',
          )}
        >
          {method.icon}
          {method.label}
        </button>
      ))}
    </div>
  )
}
