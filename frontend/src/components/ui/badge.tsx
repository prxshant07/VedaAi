import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default'|'easy'|'medium'|'hard'|'mcq'|'short'|'long'|'true_false'|'success'|'warning'|'error'
  className?: string
}

const variants: Record<string, string> = {
  default:    'bg-[hsl(48,20%,96%)] text-[hsl(215,16%,40%)] border-[hsl(220,13%,90%)]',
  easy:       'bg-[#EBF7F0] text-[#1A7A47] border-[#B7E4CC]',
  medium:     'bg-[#FEF9E7] text-[#A07800] border-[#F5D97A]',
  hard:       'bg-[#FEF0ED] text-[#B83F20] border-[#F5B4A4]',
  mcq:        'bg-blue-50 text-blue-700 border-blue-200',
  short:      'bg-green-50 text-green-700 border-green-200',
  long:       'bg-purple-50 text-purple-700 border-purple-200',
  true_false: 'bg-orange-50 text-orange-700 border-orange-200',
  success:    'bg-[#EBF7F0] text-[#1A7A47] border-[#B7E4CC]',
  warning:    'bg-[#FEF9E7] text-[#A07800] border-[#F5D97A]',
  error:      'bg-[#FEF0ED] text-[#B83F20] border-[#F5B4A4]',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-all duration-200', variants[variant] ?? variants.default, className)}>
      {children}
    </span>
  )
}
