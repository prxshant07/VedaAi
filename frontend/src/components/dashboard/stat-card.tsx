'use client'

import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon?: ReactNode
  positive?: boolean
}

export function StatCard({ title, value, change, icon, positive = true }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[14px] border border-[#E5E5E2] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[hsl(45,100%,54%)] rounded-t-[14px]" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12.5px] font-medium text-[hsl(215,16%,47%)]">{title}</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-[hsl(222,47%,11%)]">{value}</h3>
        </div>
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(222,47%,11%)] text-[hsl(45,100%,54%)]">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${positive ? 'bg-[#EBF7F0] text-[#1A7A47]' : 'bg-[#FEF0ED] text-[#B83F20]'}`}>
            {change}
          </span>
          <span className="text-[11.5px] text-[hsl(215,16%,55%)]">vs last month</span>
        </div>
      )}
    </div>
  )
}
