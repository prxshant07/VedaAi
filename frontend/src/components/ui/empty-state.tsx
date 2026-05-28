import Link from 'next/link'
import {
  FileText,
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
        flex
        h-[678px]
        items-center
        justify-center
      "
    >
      <div className="mx-auto flex max-w-[520px] flex-col items-center text-center">

        {/* Illustration / Icon */}
        <div
          className="
            mb-8
            flex
            h-28
            w-28
            items-center
            justify-center
            rounded-[28px]
            border
            border-zinc-200
            bg-zinc-50
            text-zinc-400
          "
        >
          {icon ?? <FileText size={44} strokeWidth={1.8} />}
        </div>

        {/* Title */}
        <h3
          className="
            mb-3
            text-[28px]
            font-bold
            tracking-[-0.04em]
            text-zinc-900
          "
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p
            className="
              mb-8
              max-w-[440px]
              text-[15px]
              leading-[1.75]
              text-zinc-500
            "
          >
            {description}
          </p>
        )}

        {/* Link CTA */}
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#0B1736]
              px-6
              text-[14px]
              font-semibold
              text-white
              transition-all
              duration-200
              hover:opacity-90
              hover:shadow-[0_10px_24px_rgba(11,23,54,0.18)]
            "
          >
            {actionLabel}

            <ArrowRight
              size={16}
              strokeWidth={2.3}
            />
          </Link>
        )}

        {/* Button CTA */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="
              inline-flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#0B1736]
              px-6
              text-[14px]
              font-semibold
              text-white
              transition-all
              duration-200
              hover:opacity-90
              hover:shadow-[0_10px_24px_rgba(11,23,54,0.18)]
            "
          >
            {actionLabel}

            <ArrowRight
              size={16}
              strokeWidth={2.3}
            />
          </button>
        )}
      </div>
    </div>
  )
}