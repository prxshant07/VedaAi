'use client'

import Link from 'next/link'

import {
  Clock3,
  FileText,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react'

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
  const statusStyles = {
    active:
      'bg-emerald-50 text-emerald-600',

    draft:
      'bg-amber-50 text-amber-600',

    completed:
      'bg-violet-50 text-violet-700',
  }

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
        p-5
        shadow-card
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-100/40 blur-3xl transition-all duration-500 group-hover:scale-125" />

      {/* Content */}
      <div className="relative z-10">
        {/* Top Row */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={`
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              capitalize
              ${statusStyles[status]}
            `}
          >
            {status}
          </div>

          <button
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-textSecondary
              transition-all
              hover:bg-muted
            "
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Title */}
        <div className="mt-5">
          <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-textPrimary">
            {title}
          </h3>

          <p className="mt-2 text-sm text-textSecondary">
            {subject}
          </p>
        </div>

        {/* Meta */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-textSecondary">
              <FileText size={16} />

              <span className="text-xs font-medium">
                Questions
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-textPrimary">
              {questions}
            </p>
          </div>

          <div className="rounded-2xl bg-muted/40 p-3">
            <div className="flex items-center gap-2 text-textSecondary">
              <Clock3 size={16} />

              <span className="text-xs font-medium">
                Duration
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-textPrimary">
              {duration}
            </p>
          </div>
        </div>

        {/* Difficulty */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-textSecondary">
            Difficulty
          </span>

          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            {difficulty}
          </span>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-textSecondary">
              Completion
            </span>

            <span className="text-sm font-semibold text-textPrimary">
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-violet-500
                to-violet-700
                transition-all
                duration-500
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {createdAt && (
              <p className="text-xs text-textSecondary">
                Created {createdAt}
              </p>
            )}
          </div>

          <Link
            href={
              id
                ? `/assignments/${id}`
                : '#'
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-2xl
              bg-violet-600
              px-4
              py-3
              text-sm
              font-medium
              text-white
              transition-all
              hover:bg-violet-700
              hover:scale-[1.02]
            "
          >
            Open

            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}