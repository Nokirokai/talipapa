import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, icon, ...props }, ref) => {
  return (
    <label className="relative block">
      {icon ? <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-amber-200">{icon}</span> : null}
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-talipapa-white outline-none backdrop-blur-xl placeholder:text-white/45 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20',
          Boolean(icon) && 'pl-11',
          className,
        )}
        {...props}
      />
    </label>
  )
})

Input.displayName = 'Input'
