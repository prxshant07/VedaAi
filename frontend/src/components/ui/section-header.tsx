interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-[20px] font-bold tracking-tight text-[hsl(222,47%,11%)]">{title}</h2>
        {subtitle && <p className="mt-1.5 text-[13.5px] leading-relaxed text-[hsl(215,16%,47%)]">{subtitle}</p>}
      </div>
      {action && <div className="flex flex-shrink-0 items-center gap-3">{action}</div>}
    </div>
  )
}
