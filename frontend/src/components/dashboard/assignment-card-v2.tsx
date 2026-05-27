'use client'

import Link from 'next/link'
import { MoreHorizontal, FileText, Clock3, ArrowRight } from 'lucide-react'

interface AssignmentCardV2Props {
  id?: string
  title: string
  subject: string
  questions: number
  duration: string
  difficulty?: string
  status?: 'active' | 'draft' | 'completed'
  progress?: number
  createdAt?: string
}

const statusStyles = {
  active:    { bg: 'bg-[#EBF7F0]', text: 'text-[#1A7A47]', label: '● Active' },
  draft:     { bg: 'bg-[#FEF9E7]', text: 'text-[#A07800]', label: '○ Draft' },
  completed: { bg: 'bg-[#EBF7F0]', text: 'text-[#1A7A47]', label: '✓ Completed' },
}

export function AssignmentCardV2({
  id,
  title,
  subject,
  questions,
  duration,
  difficulty = 'Medium',
  status = 'active',
  progress = 72,
  createdAt,
}: AssignmentCardV2Props) {
  const st = statusStyles[status]

  return (
    <div className="group relative bg-white border border-[#E5E5E2] rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-[1px]">

      {/* Top */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <span className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.text}`}>
          {st.label}
        </span>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[hsl(215,16%,55%)] hover:bg-[hsl(48,20%,96%)] transition-colors">
          <MoreHorizontal size={15} />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-[14.5px] font-semibold text-[hsl(222,47%,11%)] leading-snug line-clamp-2 mb-1">{title}</h3>
      <p className="text-[12.5px] text-[hsl(215,16%,47%)] mb-4">{subject}</p>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-[hsl(48,20%,97%)] border border-[hsl(220,13%,92%)] p-2.5">
          <div className="flex items-center gap-1.5 text-[hsl(215,16%,55%)] mb-1.5">
            <FileText size={13} />
            <span className="text-[11.5px] font-medium">Questions</span>
          </div>
          <p className="text-[15px] font-bold text-[hsl(222,47%,11%)]">{questions}</p>
        </div>
        <div className="rounded-xl bg-[hsl(48,20%,97%)] border border-[hsl(220,13%,92%)] p-2.5">
          <div className="flex items-center gap-1.5 text-[hsl(215,16%,55%)] mb-1.5">
            <Clock3 size={13} />
            <span className="text-[11.5px] font-medium">Duration</span>
          </div>
          <p className="text-[15px] font-bold text-[hsl(222,47%,11%)]">{duration}</p>
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12.5px] text-[hsl(215,16%,47%)]">Difficulty</span>
        <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[hsl(48,20%,96%)] text-[hsl(222,47%,30%)] border border-[hsl(220,13%,90%)]">
          {difficulty}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-[hsl(215,16%,47%)]">Completion</span>
          <span className="text-[12px] font-semibold text-[hsl(222,47%,11%)]">{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[hsl(48,20%,94%)]">
          <div
            className="h-full rounded-full bg-[hsl(222,47%,11%)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F0EFE8]">
        {createdAt && <p className="text-[11.5px] text-[hsl(215,16%,55%)]">Created {createdAt}</p>}
        <Link
          href={id ? `/assignments/${id}` : '#'}
          className="ml-auto flex items-center gap-1.5 rounded-xl bg-[hsl(222,47%,11%)] px-3.5 py-2 text-[12.5px] font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Open <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  )
}
