import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number

  className?: string

  indicatorClassName?: string
}

export function Progress({
  value,
  className,
  indicatorClassName,
}: ProgressProps) {
  const safeValue = Math.min(
    100,
    Math.max(0, value)
  )

  return (
    <div
      className={cn(
        `
          relative
          h-3
          w-full
          overflow-hidden
          rounded-full
          bg-zinc-100
          shadow-inner
        `,
        className
      )}
    >
      {/* Track Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-60" />

      {/* Progress Indicator */}
      <div
        className={cn(
          `
            relative
            h-full
            rounded-full
            bg-gradient-to-r
            from-violet-500
            via-violet-600
            to-fuchsia-500
            transition-all
            duration-700
            ease-out
            shadow-[0_0_20px_rgba(139,92,246,0.35)]
          `,
          indicatorClassName
        )}
        style={{
          width: `${safeValue}%`,
        }}
      >
        {/* Shine Effect */}
        <div
          className="
            absolute
            inset-0
            animate-shimmer
            bg-gradient-to-r
            from-transparent
            via-white/30
            to-transparent
          "
        />
      </div>
    </div>
  )
}