import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-[14px] border border-[#E5E5E2] bg-white px-6 py-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="relative z-10 mx-auto max-w-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[20px] bg-[hsl(48,20%,96%)] border border-[#E5E5E2] text-[hsl(215,16%,55%)]">
          {icon ?? <FileText size={36} />}
        </div>
        <h3 className="text-[18px] font-bold text-[hsl(222,47%,11%)] mb-2">{title}</h3>
        {description && <p className="text-[13.5px] leading-relaxed text-[hsl(215,16%,47%)] mb-6">{description}</p>}
        {actionLabel && actionHref && (
          <Link href={actionHref} className="inline-flex items-center gap-2 rounded-xl bg-[hsl(222,47%,11%)] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90">
            {actionLabel} <ArrowRight size={14} />
          </Link>
        )}
        {actionLabel && onAction && (
          <button onClick={onAction} className="inline-flex items-center gap-2 rounded-xl bg-[hsl(222,47%,11%)] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90">
            {actionLabel} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
