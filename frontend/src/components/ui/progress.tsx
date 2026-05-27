import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  indicatorClassName?: string
}

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-[hsl(220,13%,92%)]', className)}>
      <div
        className={cn('h-full rounded-full bg-[hsl(222,47%,11%)] transition-all duration-700 ease-out', indicatorClassName)}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
}
