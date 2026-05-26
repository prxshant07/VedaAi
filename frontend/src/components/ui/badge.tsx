import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode

  variant?:
    | 'default'
    | 'easy'
    | 'medium'
    | 'hard'
    | 'mcq'
    | 'short'
    | 'long'
    | 'true_false'
    | 'success'
    | 'warning'
    | 'error'

  className?: string
}

const variants: Record<
  string,
  string
> = {
  default:
    'bg-zinc-100 text-zinc-700 border-zinc-200',

  easy:
    'bg-emerald-50 text-emerald-700 border-emerald-200',

  medium:
    'bg-amber-50 text-amber-700 border-amber-200',

  hard:
    'bg-red-50 text-red-700 border-red-200',

  mcq:
    'bg-blue-50 text-blue-700 border-blue-200',

  short:
    'bg-green-50 text-green-700 border-green-200',

  long:
    'bg-purple-50 text-purple-700 border-purple-200',

  true_false:
    'bg-orange-50 text-orange-700 border-orange-200',

  success:
    'bg-emerald-50 text-emerald-700 border-emerald-200',

  warning:
    'bg-amber-50 text-amber-700 border-amber-200',

  error:
    'bg-red-50 text-red-700 border-red-200',
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        `
          inline-flex
          items-center
          justify-center
          rounded-full
          border
          px-3
          py-1
          text-[11px]
          font-semibold
          tracking-wide
          shadow-sm
          transition-all
          duration-200
        `,

        variants[variant] ??
          variants.default,

        className
      )}
    >
      {children}
    </span>
  )
}