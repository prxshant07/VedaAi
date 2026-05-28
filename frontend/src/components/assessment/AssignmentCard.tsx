import Link from 'next/link'
import { MoreVertical, Calendar } from 'lucide-react'

import { Assignment } from '@/types'
import {
  formatDate,
  QUESTION_TYPE_LABELS,
} from '@/lib/utils'

interface AssignmentCardProps {
  assignment: Assignment
  compact?: boolean
}

const FIGMA_STATUS: Record<
  string,
  {
    dot: string
    bg: string
    text: string
    label: string
  }
> = {
  completed: {
    dot: '●',
    bg: 'bg-[#EBF7F0]',
    text: 'text-[#1A7A47]',
    label: 'Active',
  },

  draft: {
    dot: '○',
    bg: 'bg-[#FEF9E7]',
    text: 'text-[#A07800]',
    label: 'Draft',
  },

  queued: {
    dot: '◌',
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1E5FAD]',
    label: 'Queued',
  },

  processing: {
    dot: '◌',
    bg: 'bg-[#F3F0FF]',
    text: 'text-[#5B2DA6]',
    label: 'Processing',
  },

  failed: {
    dot: '✕',
    bg: 'bg-[#FEF0ED]',
    text: 'text-[#B83F20]',
    label: 'Failed',
  },
}

export function AssignmentCard({
  assignment,
  compact = false,
}: AssignmentCardProps) {
  const st =
    FIGMA_STATUS[assignment.status] ??
    FIGMA_STATUS.draft

  return (
    <Link
      href={`/assessments/${assignment._id}`}
      className="block group"
    >
      <div
        className="
          relative
          rounded-2xl
          border
          border-zinc-200/70
          bg-white
          p-5
          shadow-[0_1px_2px_rgba(0,0,0,0.03)]
          transition-all
          duration-200
          hover:-translate-y-[2px]
          hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]
        "
      >

        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3
            className="
              flex-1
              line-clamp-2
              text-[15px]
              font-semibold
              leading-[1.35]
              tracking-[-0.01em]
              text-zinc-900
            "
          >
            {assignment.title}
          </h3>

          <button
            onClick={(e) => e.preventDefault()}
            className="
              flex
              h-8
              w-8
              flex-shrink-0
              items-center
              justify-center
              rounded-xl
              text-zinc-400
              transition-colors
              hover:bg-zinc-100
              hover:text-zinc-700
            "
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Subject */}
        {assignment.subject && (
          <p className="mb-4 text-[13px] text-zinc-500">
            {assignment.subject}
          </p>
        )}

        {!compact && (
          <>

            {/* Dates */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-[12.5px] text-zinc-500">
                <Calendar
                  size={13}
                  className="text-zinc-400"
                />

                <span>
                  Assignment:{' '}
                  {formatDate(assignment.createdAt)}
                </span>
              </div>
            </div>

            {/* Question Types */}
            {assignment.questionTypes?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {assignment.questionTypes
                  .slice(0, 3)
                  .map((type) => (
                    <span
                      key={type}
                      className="
                        rounded-full
                        border
                        border-zinc-200
                        bg-zinc-50
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        text-zinc-600
                      "
                    >
                      {QUESTION_TYPE_LABELS[type]}
                    </span>
                  ))}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">

          {/* Status */}
          <span
            className={`
              inline-flex
              items-center
              gap-1
              rounded-full
              px-2.5
              py-1
              text-[11.5px]
              font-semibold
              ${st.bg}
              ${st.text}
            `}
          >
            {st.dot} {st.label}
          </span>

          {/* Due Date */}
          <div className="text-right">
            <div className="text-[11px] text-zinc-400">
              Due
            </div>

            <div className="text-[12.5px] font-semibold text-zinc-700">
              {formatDate(assignment.dueDate)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}