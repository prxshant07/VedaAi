import Link from 'next/link'

import {
  ArrowRight,
  Clock3,
  FileText,
  Sparkles,
} from 'lucide-react'

import { Assignment } from '@/types'

import {
  formatDate,
  STATUS_COLORS,
  QUESTION_TYPE_LABELS,
} from '@/lib/utils'

interface AssignmentCardProps {
  assignment: Assignment
  compact?: boolean
}

export function AssignmentCard({
  assignment,
  compact = false,
}: AssignmentCardProps) {
  const diffColors = {
    easy: '#4ade80',
    medium: '#facc15',
    hard: '#f87171',
  }

  return (
    <Link
      href={`/assessments/${assignment._id}`}
      className="block group"
    >
      <div
        className="
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
        {/* Glow */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-100/40 blur-3xl transition-all duration-500 group-hover:scale-125" />

        <div className="relative z-10">
          {/* Top */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3
                className="
                  line-clamp-2
                  text-xl
                  font-semibold
                  leading-snug
                  text-textPrimary
                  transition-colors
                  group-hover:text-violet-700
                "
              >
                {assignment.title}
              </h3>

              {assignment.subject && (
                <p className="mt-2 text-sm text-textSecondary">
                  {assignment.subject}
                </p>
              )}
            </div>

            <span
              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                capitalize
                flex-shrink-0
                ${STATUS_COLORS[assignment.status]}
              `}
            >
              {assignment.status}
            </span>
          </div>

          {!compact && (
            <>
              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-textSecondary">
                    <FileText size={16} />

                    <span className="text-xs font-medium">
                      Questions
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-semibold text-textPrimary">
                    {assignment.totalQuestions}
                  </p>
                </div>

                <div className="rounded-2xl bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-textSecondary">
                    <Clock3 size={16} />

                    <span className="text-xs font-medium">
                      Marks
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-semibold text-textPrimary">
                    {assignment.totalMarks}
                  </p>
                </div>
              </div>

              {/* Due Date */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-textSecondary">
                  Due Date
                </span>

                <span className="text-sm font-medium text-textPrimary">
                  {formatDate(
                    assignment.dueDate
                  )}
                </span>
              </div>

              {/* Question Types */}
              <div className="mt-5 flex flex-wrap gap-2">
                {assignment.questionTypes.map(
                  (type) => (
                    <span
                      key={type}
                      className="
                        rounded-full
                        bg-violet-50
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-violet-700
                      "
                    >
                      {
                        QUESTION_TYPE_LABELS[
                          type
                        ]
                      }
                    </span>
                  )
                )}
              </div>

              {/* Difficulty */}
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-textSecondary">
                    Difficulty Distribution
                  </span>
                </div>

                <div className="flex gap-1 overflow-hidden rounded-full">
                  {(
                    [
                      'easy',
                      'medium',
                      'hard',
                    ] as const
                  ).map((level) => {
                    const pct =
                      assignment
                        .difficultyDistribution?.[
                        level
                      ] ?? 0

                    return pct > 0 ? (
                      <div
                        key={level}
                        className="h-2 rounded-full transition-all"
                        style={{
                          flex: pct,
                          background:
                            diffColors[
                              level
                            ],
                          minWidth: 8,
                        }}
                        title={`${level}: ${pct}%`}
                      />
                    ) : null
                  })}
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-textSecondary">
                  <span>
                    Easy{' '}
                    {assignment
                      .difficultyDistribution
                      ?.easy ?? 0}
                    %
                  </span>

                  <span>
                    Medium{' '}
                    {assignment
                      .difficultyDistribution
                      ?.medium ?? 0}
                    %
                  </span>

                  <span>
                    Hard{' '}
                    {assignment
                      .difficultyDistribution
                      ?.hard ?? 0}
                    %
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <div className="flex items-center gap-2 text-textSecondary">
              <Sparkles size={14} />

              <span className="text-xs">
                Created{' '}
                {formatDate(
                  assignment.createdAt
                )}
              </span>
            </div>

            <div
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
                group-hover:bg-violet-700
              "
            >
              Open

              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}