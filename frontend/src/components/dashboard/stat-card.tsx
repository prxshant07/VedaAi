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
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-border
        bg-white
        p-6
        shadow-card
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {/* Glow Background */}
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-100/50 blur-3xl transition-all duration-500 group-hover:scale-125" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-textSecondary">
              {title}
            </p>

            <h3 className="mt-4 text-3xl font-bold tracking-tight text-textPrimary">
              {value}
            </h3>
          </div>

          {icon && (
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-violet-50
                text-violet-700
              "
            >
              {icon}
            </div>
          )}
        </div>

        {/* Footer */}
        {change && (
          <div className="mt-6 flex items-center gap-2">
            <div
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                positive
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {change}
            </div>

            <span className="text-xs text-textSecondary">
              vs last month
            </span>
          </div>
        )}
      </div>
    </div>
  )
}