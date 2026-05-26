import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        `
          skeleton-shimmer
          relative
          overflow-hidden
          rounded-2xl
          bg-zinc-100
        `,
        className
      )}
    />
  )
}

/* =========================================
   ASSIGNMENT CARD SKELETON
========================================= */

export function AssignmentCardSkeleton() {
  return (
    <div
      className="
        rounded-[28px]
        border
        border-border
        bg-white
        p-5
        shadow-card
      "
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-4/5" />

          <Skeleton className="h-4 w-1/3" />
        </div>

        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-muted/40 p-3">
          <Skeleton className="h-4 w-20" />

          <Skeleton className="mt-3 h-6 w-12" />
        </div>

        <div className="rounded-2xl bg-muted/40 p-3">
          <Skeleton className="h-4 w-16" />

          <Skeleton className="mt-3 h-6 w-10" />
        </div>
      </div>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-20 rounded-full" />

        <Skeleton className="h-7 w-16 rounded-full" />

        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      {/* Progress */}
      <div className="mt-5">
        <Skeleton className="mb-3 h-4 w-40" />

        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
        <Skeleton className="h-4 w-28" />

        <Skeleton className="h-11 w-24 rounded-2xl" />
      </div>
    </div>
  )
}

/* =========================================
   PAPER SKELETON
========================================= */

export function PaperSkeleton() {
  return (
    <div
      className="
        rounded-[32px]
        border
        border-border
        bg-white
        p-6
        shadow-card
      "
    >
      {/* Header */}
      <div className="text-center">
        <Skeleton className="mx-auto h-8 w-1/2" />

        <Skeleton className="mx-auto mt-3 h-4 w-1/3" />
      </div>

      {/* Metadata */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="
              rounded-2xl
              bg-muted/40
              p-4
            "
          >
            <Skeleton className="h-4 w-16" />

            <Skeleton className="mt-3 h-6 w-12" />
          </div>
        ))}
      </div>

      {/* Questions */}
      <div className="mt-10 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="
              rounded-[28px]
              border
              border-border
              p-5
            "
          >
            {/* Question Header */}
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-6 w-2/3" />

              <Skeleton className="h-7 w-16 rounded-full" />
            </div>

            {/* Lines */}
            <div className="mt-5 space-y-3">
              <Skeleton className="h-4 w-full" />

              <Skeleton className="h-4 w-11/12" />

              <Skeleton className="h-4 w-4/5" />
            </div>

            {/* Options */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded-xl" />

              <Skeleton className="h-8 w-24 rounded-xl" />

              <Skeleton className="h-8 w-16 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}