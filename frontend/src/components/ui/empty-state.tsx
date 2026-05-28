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
        h-[780px]
        w-full
        items-center
        justify-center
        overflow-hidden
        rounded-[32px]
      "
      style={{
        background:
          'linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)',
      }}
    >

      {/* Atmospheric top glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-40
        "
        style={{
          background:
            'radial-gradient(circle at top, rgba(255,255,255,0.75) 0%, transparent 58%)',
        }}
      />

      {/* Left atmospheric shadow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          w-[220px]
        "
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.03) 0%, transparent 100%)',
        }}
      />

      {/* Right atmospheric shadow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          right-0
          w-[220px]
        "
        style={{
          background:
            'linear-gradient(270deg, rgba(0,0,0,0.03) 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-[640px]
          flex-col
          items-center
          px-8
          py-20
          text-center
        "
      >

        {/* Illustration / Icon */}
        <div className="mb-10 flex items-center justify-center">

          {illustration ? (
            <Image
              src={illustration}
              alt={title}
              width={320}
              height={320}
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