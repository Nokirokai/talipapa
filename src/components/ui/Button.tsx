import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'clay' | 'glass' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  clay: 'bg-amber-400 text-slate-950 shadow-clay active:shadow-clay-pressed hover:bg-amber-300',
  glass: 'backdrop-blur-xl bg-white/10 border border-white/15 text-talipapa-white shadow-glass hover:bg-white/15',
  danger: 'bg-red-400 text-white shadow-clay active:shadow-clay-pressed hover:bg-red-300',
  ghost: 'text-talipapa-white hover:bg-white/10',
}

export function Button({ className, variant = 'clay', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
