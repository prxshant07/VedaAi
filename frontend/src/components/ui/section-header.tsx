interface SectionHeaderProps {
  title: string

  subtitle?: string

  action?: React.ReactNode
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: SectionHeaderProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-5
        md:flex-row
        md:items-end
        md:justify-between
      "
    >
      {/* Left */}
      <div className="max-w-2xl">
        <h2
          className="
            text-2xl
            font-bold
            tracking-tight
            text-textPrimary
            xl:text-3xl
          "
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="
              mt-3
              text-sm
              leading-relaxed
              text-textSecondary
              md:text-base
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Action */}
      {action && (
        <div
          className="
            flex
            flex-shrink-0
            items-center
            gap-3
          "
        >
          {action}
        </div>
      )}
    </div>
  )
}