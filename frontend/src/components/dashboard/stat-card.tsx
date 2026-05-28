'use client'

import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon?: ReactNode
  positive?: boolean
}

export function StatCard({
  title,
  value,
  change,
  icon,
  positive = true,
}: StatCardProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[24px]
        bg-[#F8F8F8]
        px-[24px]
        py-[22px]
        transition-all
        duration-200
        hover:-translate-y-[1px]
      "
    >

      {/* Top */}
      <div className="flex items-start justify-between gap-4">

        {/* Left */}
        <div>

          {/* Title */}
          <p
            className="
              text-[14px]
              font-[600]
              tracking-[-0.03em]
              text-[#7A7A7A]
            "
          >
            {title}
          </p>

          {/* Value */}
          <h3
            className="
              mt-[10px]
              text-[36px]
              font-[700]
              leading-none
              tracking-[-0.06em]
              text-[#1A1A1A]
            "
          >
            {value}
          </h3>
        </div>

        {/* Icon */}
        {icon && (
          <div
            className="
              flex
              h-[48px]
              w-[48px]
              items-center
              justify-center
              rounded-[16px]
              bg-[#101010]
              text-[#FFD84D]
            "
          >
            {icon}
          </div>
        )}
      </div>

      {/* Bottom */}
      {change && (
        <div className="mt-[20px] flex items-center gap-2">

          <span
            className={`
              rounded-full
              px-[10px]
              py-[4px]
              text-[12px]
              font-[600]
              ${
                positive
                  ? 'bg-[#EAF8EF] text-[#1A7A47]'
                  : 'bg-[#FEF0ED] text-[#C54828]'
              }
            `}
          >
            {change}
          </span>

          <span
            className="
              text-[12px]
              text-[#8A8A8A]
            "
          >
            vs last month
          </span>
        </div>
      )}
    </div>
  )
}