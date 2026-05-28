'use client'

import Link from 'next/link'
import Image from 'next/image'

import {
  ArrowRight,
} from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  illustration?: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon,
  illustration,
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
        flex
        h-[690px]
        items-start
        justify-center
        pt-[42px]
      "
    >

      {/* Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          max-w-[640px]
          flex-col
          items-center
          text-center
        "
      >

        {/* Illustration / Icon */}
        <div className="mb-8 flex items-center justify-center">

          {illustration ? (
            <Image
              src={illustration}
              alt={title}
              width={300}
              height={300}
              priority
              className="object-contain"
            />
          ) : (
            <div
              className="
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
              {icon}
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className="
            mb-4
            w-[181px]
            text-center
            font-[700]
            text-[20px]
            leading-[140%]
            tracking-[-0.04em]
            text-[#303030]
            font-[family-name:var(--font-bricolage)]
          "
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p
            className="
              mb-10
              w-[486px]
              text-center
              font-[400]
              text-[16px]
              leading-[140%]
              tracking-[-0.04em]
              text-[#5E5E5ECC]
              font-[family-name:var(--font-bricolage)]
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
              h-14
              items-center
              justify-center
              gap-2
              rounded-[18px]
              bg-[#0B1736]
              px-7
              text-[15px]
              font-semibold
              text-white
              transition-all
              duration-200
              hover:opacity-90
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
              h-14
              items-center
              justify-center
              gap-2
              rounded-[18px]
              bg-[#0B1736]
              px-7
              text-[15px]
              font-semibold
              text-white
              transition-all
              duration-200
              hover:opacity-90
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