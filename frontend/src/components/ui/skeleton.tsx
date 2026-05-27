import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton-shimmer relative overflow-hidden rounded-xl bg-[hsl(220,13%,94%)]', className)} />
}

export function AssignmentCardSkeleton() {
  return (
    <div className="rounded-[14px] border border-[#E5E5E2] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-1/3 mb-4" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <div className="flex items-center justify-between pt-3 border-t border-[#F0EFE8]">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  )
}

export function PaperSkeleton() {
  return (
    <div className="rounded-[14px] border border-[#E5E5E2] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="text-center mb-6">
        <Skeleton className="mx-auto h-7 w-1/2 mb-2" />
        <Skeleton className="mx-auto h-4 w-1/3" />
      </div>
      <div className="space-y-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-[#E5E5E2] rounded-xl p-4">
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-11/12" />
          </div>
        ))}
      </div>
    </div>
  )
}
