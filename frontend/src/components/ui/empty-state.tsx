import Link from 'next/link'

import {
  Sparkles,
  ArrowRight,
} from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode

  title: string

  description?: string

  actionLabel?: string

  actionHref?: string

  onAction?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-border
        bg-white
        px-6
        py-16
        text-center
        shadow-card
      "
    >
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-violet-100/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-md">
        {/* Icon */}
        <div
          className="
            mx-auto
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-[28px]
            bg-violet-50
            text-violet-600
            shadow-sm
          "
        >
          {icon ?? (
            <Sparkles size={42} />
          )}
        </div>

        {/* Title */}
        <h3 className="mt-8 text-2xl font-bold tracking-tight text-textPrimary">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-4 text-base leading-relaxed text-textSecondary">
            {description}
          </p>
        )}

        {/* Action Link */}
        {actionLabel &&
          actionHref && (
            <Link
              href={actionHref}
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-violet-600
                px-6
                py-4
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-violet-500/20
                transition-all
                hover:scale-[1.02]
                hover:bg-violet-700
              "
            >
              {actionLabel}

              <ArrowRight size={16} />
            </Link>
          )}

        {/* Action Button */}
        {actionLabel &&
          onAction && (
            <button
              onClick={onAction}
              className="
                mt-8
                inline-flex
                items-center
                gap-2
                rounded-2xl
                bg-violet-600
                px-6
                py-4
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-violet-500/20
                transition-all
                hover:scale-[1.02]
                hover:bg-violet-700
              "
            >
              {actionLabel}

              <ArrowRight size={16} />
            </button>
          )}
      </div>
    </div>
  )
}