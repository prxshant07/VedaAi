import { cn } from '@/lib/utils'

export function Skeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        `
          skeleton-shimmer
          relative
          overflow-hidden
          rounded-xl
          bg-[#E4E4E4]
        `,
        className
      )}
    />
  )
}

export function AssignmentCardSkeleton() {
  return (
    <div
      className="
        rounded-[24px]
        border
        border-[#E2E2E2]
        bg-[#F7F7F7]
        p-5
        shadow-[0_1px_3px_rgba(0,0,0,0.03)]
      "
    >

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">

        <Skeleton className="h-5 w-4/5" />

        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Subject */}
      <Skeleton className="mb-4 h-4 w-1/3 bg-[#F3F3F3]" />

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3">

        <Skeleton
          className="
            h-20
            rounded-2xl
            bg-[#F3F3F3]
          "
        />

        <Skeleton
          className="
            h-20
            rounded-2xl
            bg-[#F3F3F3]
          "
        />
      </div>

      {/* Question Types */}
      <div className="mb-4 flex gap-2">

        <Skeleton
          className="
            h-6
            w-20
            rounded-full
            bg-[#F3F3F3]
          "
        />

        <Skeleton
          className="
            h-6
            w-20
            rounded-full
            bg-[#F3F3F3]
          "
        />
      </div>

      {/* Difficulty */}
      <Skeleton
        className="
          mb-5
          h-2
          w-full
          rounded-full
          bg-[#F3F3F3]
        "
      />

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#E2E2E2] pt-4">

        <Skeleton className="h-4 w-24 bg-[#F3F3F3]" />

        <Skeleton
          className="
            h-9
            w-24
            rounded-xl
          "
        />
      </div>
    </div>
  )
}

export function PaperSkeleton() {
  return (
    <div
      className="
        rounded-[24px]
        border
        border-[#E2E2E2]
        bg-[#F7F7F7]
        p-6
        shadow-[0_1px_3px_rgba(0,0,0,0.03)]
      "
    >

      {/* Header */}
      <div className="mb-8 text-center">

        <Skeleton
          className="
            mx-auto
            mb-3
            h-7
            w-1/2
          "
        />

        <Skeleton
          className="
            mx-auto
            h-4
            w-1/3
            bg-[#F3F3F3]
          "
        />
      </div>

      {/* Sections */}
      <div className="space-y-5">

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="
              rounded-2xl
              border
              border-[#E2E2E2]
              bg-[#FAFAFA]
              p-5
            "
          >

            <Skeleton
              className="
                mb-4
                h-5
                w-3/4
              "
            />

            <Skeleton
              className="
                mb-2
                h-4
                w-full
                bg-[#F3F3F3]
              "
            />

            <Skeleton
              className="
                h-4
                w-11/12
                bg-[#F3F3F3]
              "
            />
          </div>
        ))}
      </div>
    </div>
  )
}