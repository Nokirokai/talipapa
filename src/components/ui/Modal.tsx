import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  className?: string
}

export function Modal({ open, title, children, onClose, className = '' }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md print:bg-white print:p-0">
      <div className={`max-h-[92vh] w-full max-w-2xl overflow-auto rounded-3xl border border-white/20 bg-white/10 p-5 text-talipapa-white shadow-2xl backdrop-blur-xl print:max-h-none print:border-0 print:bg-white print:p-0 print:text-black print:shadow-none ${className}`}>
        <div className="mb-4 flex items-center justify-between print:hidden">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <Button variant="ghost" className="h-10 w-10 p-0" onClick={onClose} aria-label="Isara">
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
