import { cn } from '../../lib/utils'

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-2xl bg-[linear-gradient(100deg,rgba(255,255,255,0.08)_30%,rgba(255,255,255,0.18)_50%,rgba(255,255,255,0.08)_70%)] bg-[length:200%_100%]',
        className,
      )}
    />
  )
}
