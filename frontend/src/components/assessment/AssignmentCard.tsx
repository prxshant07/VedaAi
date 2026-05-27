import Link from 'next/link'
import { MoreVertical, Calendar, Clock3 } from 'lucide-react'
import { Assignment } from '@/types'
import { formatDate, STATUS_COLORS, QUESTION_TYPE_LABELS } from '@/lib/utils'

interface AssignmentCardProps {
  assignment: Assignment
  compact?: boolean
}

const FIGMA_STATUS: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  completed: { dot: '●', bg: 'bg-[#EBF7F0]', text: 'text-[#1A7A47]', label: 'Active' },
  draft:     { dot: '○', bg: 'bg-[#FEF9E7]', text: 'text-[#A07800]', label: 'Draft' },
  queued:    { dot: '◌', bg: 'bg-[#EFF6FF]', text: 'text-[#1E5FAD]', label: 'Queued' },
  processing:{ dot: '◌', bg: 'bg-[#F3F0FF]', text: 'text-[#5B2DA6]', label: 'Processing' },
  failed:    { dot: '✕', bg: 'bg-[#FEF0ED]', text: 'text-[#B83F20]', label: 'Failed' },
}

export function AssignmentCard({ assignment, compact = false }: AssignmentCardProps) {
  const st = FIGMA_STATUS[assignment.status] ?? FIGMA_STATUS.draft

  return (
    <Link href={`/assessments/${assignment._id}`} className="block group">
      <div className="relative bg-white border border-[#E5E5E2] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-[1px]">

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-[14.5px] font-semibold text-[hsl(222,47%,11%)] leading-snug line-clamp-2 flex-1">
            {assignment.title}
          </h3>
          <button
            onClick={(e) => e.preventDefault()}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[hsl(215,16%,55%)] hover:bg-[hsl(48,20%,96%)] transition-colors flex-shrink-0"
          >
            <MoreVertical size={15} />
          </button>
        </div>

        {/* Subject */}
        {assignment.subject && (
          <p className="text-[12.5px] text-[hsl(215,16%,47%)] mb-3">
            {assignment.subject}
          </p>
        )}

        {!compact && (
          <>
            {/* Date rows */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-1.5 text-[12.5px] text-[hsl(215,16%,47%)]">
                <Calendar size={13} className="text-[hsl(215,16%,60%)]" />
                <span>Assignment: {formatDate(assignment.createdAt)}</span>
              </div>
            </div>

            {/* Question types */}
            {assignment.questionTypes?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {assignment.questionTypes.slice(0, 3).map((type) => (
                  <span key={type} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[hsl(48,20%,96%)] text-[hsl(215,16%,40%)] border border-[hsl(220,13%,90%)]">
                    {QUESTION_TYPE_LABELS[type]}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F0EFE8]">
          <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
            {st.dot} {st.label}
          </span>
          <div className="text-right">
            <div className="text-[11px] text-[hsl(215,16%,60%)]">Due</div>
            <div className="text-[12.5px] font-semibold text-[hsl(215,16%,40%)]">
              {formatDate(assignment.dueDate)}
            </div>
          </div>
        </div>

      </div>
    </Link>
  )
}
