import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-2xl border border-white/15 bg-white/8 shadow-glass backdrop-blur-xl', className)}
      {...props}
    />
  )
}
