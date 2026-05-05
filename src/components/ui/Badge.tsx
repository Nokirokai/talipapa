import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'clay' | 'glass' | 'outline'

const variants: Record<Variant, string> = {
  clay: 'bg-amber-400 text-slate-950 shadow-clay',
  glass: 'bg-white/10 text-white border border-white/15 backdrop-blur-md',
  outline: 'border border-white/20 text-white/60',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

export function Badge({ className, variant = 'clay', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
